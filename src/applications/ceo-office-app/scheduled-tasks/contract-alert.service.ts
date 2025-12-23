import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    AppartementVide,
    AppartementVideDocument,
} from '../entities/appartement-vide.entity';
import {
    AppartementMeuble,
    AppartementMeubleDocument,
} from '../entities/appartement-meuble.entity';
import { MailService } from '../../../core/mail/mail.service';

/**
 * Interface représentant un contrat avec date d'expiration proche
 */
export interface ExpiringContract {
    type: 'APPARTEMENT_VIDE' | 'APPARTEMENT_MEUBLE';
    employeeName: string;
    employeeCompany: string;
    department: string;
    residenceName: string;
    endDate: string;
    daysRemaining: number;
    monthlyRent?: number;
    currency?: string;
    status?: string;
}

/**
 * Service de tâches planifiées pour les alertes de contrats
 * Exécute automatiquement des vérifications hebdomadaires
 * pour identifier les contrats arrivant à expiration
 */
@Injectable()
export class ContractAlertService {
    private readonly logger = new Logger(ContractAlertService.name);

    /**
     * Liste des emails des administrateurs à notifier
     */
    private readonly adminEmails: string[] = [
        'leatitia.tchokouani@sa-ucb.com',
        'christian.nana@sa-ucb.com',
    ];

    /**
     * Nombre de jours avant expiration pour déclencher l'alerte (2 mois ≈ 60 jours)
     */
    private readonly ALERT_THRESHOLD_DAYS = 60;

    constructor(
        @InjectModel(AppartementVide.name)
        private appartementVideModel: Model<AppartementVideDocument>,
        @InjectModel(AppartementMeuble.name)
        private appartementMeubleModel: Model<AppartementMeubleDocument>,
        private readonly mailService: MailService,
    ) {}

    /**
     * Tâche planifiée exécutée chaque Lundi à 08h00
     * Vérifie les contrats arrivant à expiration dans les 2 prochains mois
     * et envoie une notification aux administrateurs
     * 
     * Expression Cron: '0 8 * * 1' = À 08:00 chaque Lundi
     */
    @Cron('0 8 * * 1', {
        name: 'contract-expiration-alert',
        timeZone: 'Africa/Douala',
    })
    async handleContractExpirationAlert(): Promise<void> {
        this.logger.log('🔄 Démarrage de la vérification des contrats expirant bientôt...');

        try {
            const expiringContracts = await this.findExpiringContracts();

            if (expiringContracts.length === 0) {
                this.logger.log('✅ Aucun contrat expirant dans les 2 prochains mois.');
                return;
            }

            this.logger.log(`⚠️ ${expiringContracts.length} contrat(s) expirant dans moins de 2 mois détecté(s).`);

            // Envoyer l'email aux administrateurs
            await this.sendExpirationAlertEmail(expiringContracts);

            this.logger.log('✅ Emails d\'alerte envoyés avec succès aux administrateurs.');
        } catch (error) {
            this.logger.error('❌ Erreur lors de la vérification des contrats:', error);
            throw error;
        }
    }

    /**
     * Recherche tous les contrats (appartements vides et meublés)
     * dont la date de fin est dans les 2 prochains mois
     */
    async findExpiringContracts(): Promise<ExpiringContract[]> {
        const today = new Date();
        const twoMonthsFromNow = new Date();
        twoMonthsFromNow.setDate(today.getDate() + this.ALERT_THRESHOLD_DAYS);

        const expiringContracts: ExpiringContract[] = [];

        // Recherche dans les appartements vides
        const appartementsVides = await this.appartementVideModel
            .find({
                status: { $nin: ['ANNULE'] }, // Exclure les contrats annulés
            })
            .exec();

        for (const appartement of appartementsVides) {
            if (appartement.endDate) {
                const endDate = this.parseDate(appartement.endDate);
                if (endDate && endDate >= today && endDate <= twoMonthsFromNow) {
                    const daysRemaining = Math.ceil(
                        (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                    );

                    expiringContracts.push({
                        type: 'APPARTEMENT_VIDE',
                        employeeName: appartement.employeeName,
                        employeeCompany: appartement.employeeCompany,
                        department: appartement.department,
                        residenceName: appartement.residenceName,
                        endDate: appartement.endDate,
                        daysRemaining,
                        monthlyRent: appartement.monthlyRent,
                        currency: appartement.currency,
                        status: appartement.status,
                    });
                }
            }
        }

        // Recherche dans les appartements meublés (checkOutDate)
        const appartementsMeubles = await this.appartementMeubleModel
            .find({
                status: { $nin: ['CANCELLED'] }, // Exclure les réservations annulées
            })
            .exec();

        for (const appartement of appartementsMeubles) {
            if (appartement.checkOutDate) {
                const checkOutDate = this.parseDate(appartement.checkOutDate);
                if (checkOutDate && checkOutDate >= today && checkOutDate <= twoMonthsFromNow) {
                    const daysRemaining = Math.ceil(
                        (checkOutDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                    );

                    expiringContracts.push({
                        type: 'APPARTEMENT_MEUBLE',
                        employeeName: `${appartement.employeeName} ${appartement.employeeFirstName || ''}`.trim(),
                        employeeCompany: appartement.employeeCompany,
                        department: appartement.department,
                        residenceName: appartement.residenceName,
                        endDate: appartement.checkOutDate,
                        daysRemaining,
                        currency: appartement.currency,
                        status: appartement.status,
                    });
                }
            }
        }

        // Trier par nombre de jours restants (les plus urgents en premier)
        return expiringContracts.sort((a, b) => a.daysRemaining - b.daysRemaining);
    }

    /**
     * Parse une date string en objet Date
     * Supporte les formats: YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY
     */
    private parseDate(dateStr: string): Date | null {
        if (!dateStr) return null;

        // Essayer le format ISO (YYYY-MM-DD)
        let date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
            return date;
        }

        // Essayer le format DD/MM/YYYY ou DD-MM-YYYY
        const parts = dateStr.split(/[\/\-]/);
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            
            if (day > 31) {
                // Format YYYY-MM-DD
                date = new Date(day, month, year);
            } else {
                // Format DD-MM-YYYY
                date = new Date(year, month, day);
            }
            
            if (!isNaN(date.getTime())) {
                return date;
            }
        }

        return null;
    }

    /**
     * Envoie l'email d'alerte aux administrateurs avec la liste des contrats expirants
     */
    private async sendExpirationAlertEmail(contracts: ExpiringContract[]): Promise<void> {
        for (const adminEmail of this.adminEmails) {
            await this.mailService.sendContractExpirationAlert(
                adminEmail,
                contracts,
            );
        }
    }

    /**
     * Méthode manuelle pour déclencher la vérification
     * Utile pour les tests ou déclenchement manuel via API
     */
    async triggerManualCheck(): Promise<{
        success: boolean;
        contractsFound: number;
        contracts: ExpiringContract[];
    }> {
        this.logger.log('🔧 Déclenchement manuel de la vérification des contrats...');
        
        const contracts = await this.findExpiringContracts();
        
        if (contracts.length > 0) {
            await this.sendExpirationAlertEmail(contracts);
        }

        return {
            success: true,
            contractsFound: contracts.length,
            contracts,
        };
    }
}
