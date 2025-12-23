import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ContractAlertService, ExpiringContract } from './contract-alert.service';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';

/**
 * Contrôleur pour la gestion manuelle des alertes de contrats
 * Permet aux administrateurs de déclencher manuellement les vérifications
 * et de consulter les contrats expirants
 */
@Controller('ceo-office/contract-alerts')
@UseGuards(JwtAuthGuard)
export class ContractAlertController {
    constructor(private readonly contractAlertService: ContractAlertService) {}

    /**
     * Déclenche manuellement la vérification des contrats expirants
     * et envoie les emails d'alerte aux administrateurs
     * 
     * POST /ceo-office/contract-alerts/trigger
     */
    @Post('trigger')
    async triggerAlert(): Promise<{
        success: boolean;
        contractsFound: number;
        contracts: ExpiringContract[];
    }> {
        return this.contractAlertService.triggerManualCheck();
    }

    /**
     * Récupère la liste des contrats expirant dans les 2 prochains mois
     * sans envoyer d'email
     * 
     * GET /ceo-office/contract-alerts/expiring
     */
    @Get('expiring')
    async getExpiringContracts(): Promise<{
        count: number;
        contracts: ExpiringContract[];
    }> {
        const contracts = await this.contractAlertService.findExpiringContracts();
        return {
            count: contracts.length,
            contracts,
        };
    }
}
