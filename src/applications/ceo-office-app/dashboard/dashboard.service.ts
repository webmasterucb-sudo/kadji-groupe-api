import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TravelTicket } from '../entities/ceo-office-app.entity';
import { MissionExpense } from '../entities/mission-expense.entity';
import { HotelApartement } from '../entities/hotel-apartement.entity';
import { AppartementMeuble } from '../entities/appartement-meuble.entity';
import { AppartementVide } from '../entities/appartement-vide.entity';

export interface CurrencyBreakdown {
  [currency: string]: number;
}

export interface StatusBreakdown {
  [status: string]: number;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(TravelTicket.name)
    private travelTicketModel: Model<TravelTicket>,
    @InjectModel(MissionExpense.name)
    private missionExpenseModel: Model<MissionExpense>,
    @InjectModel(HotelApartement.name)
    private hotelApartementModel: Model<HotelApartement>,
    @InjectModel(AppartementMeuble.name)
    private appartementMeubleModel: Model<AppartementMeuble>,
    @InjectModel(AppartementVide.name)
    private appartementVideModel: Model<AppartementVide>,
  ) {}

  /**
   * Agrège les montants par devise
   */
  private aggregateByCurrency<T>(
    items: T[],
    amountField: keyof T,
    currencyField: keyof T,
  ): CurrencyBreakdown {
    return items.reduce((acc: CurrencyBreakdown, item) => {
      const currency = (item[currencyField] as string) || 'NON_DEFINI';
      const amount = (item[amountField] as number) || 0;
      acc[currency] = (acc[currency] || 0) + amount;
      return acc;
    }, {});
  }

  /**
   * Compte les éléments par statut
   */
  private countByStatus<T>(items: T[], statusField: keyof T): StatusBreakdown {
    return items.reduce((acc: StatusBreakdown, item) => {
      const status = (item[statusField] as string) || 'INCONNU';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Calcule le total tous devises confondues
   */
  private calculateTotal(breakdown: CurrencyBreakdown): number {
    return Object.values(breakdown).reduce((sum, amount) => sum + amount, 0);
  }

  async getDashboardData() {
    const today = new Date();

    // ============================================
    // 1. STATISTIQUES DES BILLETS DE VOYAGE
    // ============================================
    const allTickets = await this.travelTicketModel.find();
    const totalTicketsCount = allTickets.length;

    // Billets payés avec répartition par devise
    const paidTickets = allTickets.filter((ticket) => ticket.status === 'PAID');
    const paidTicketsByCurrency = this.aggregateByCurrency(
      paidTickets,
      'prixBilletAvion',
      'devises',
    );
    const totalPaidTicketsAmount = this.calculateTotal(paidTicketsByCurrency);

    // Répartition des billets par statut
    const ticketsByStatus = this.countByStatus(allTickets, 'status');

    // Billets par entreprise
    const ticketsByCompany = allTickets.reduce(
      (acc: { [key: string]: number }, ticket) => {
        const company = ticket.entreprise || 'NON_DEFINI';
        acc[company] = (acc[company] || 0) + 1;
        return acc;
      },
      {},
    );

    // Billets par classe de voyage
    const ticketsByClass = allTickets.reduce(
      (acc: { [key: string]: number }, ticket) => {
        const classe = ticket.classe || 'NON_DEFINI';
        acc[classe] = (acc[classe] || 0) + 1;
        return acc;
      },
      {},
    );

    // ============================================
    // 2. STATISTIQUES DES FRAIS DE MISSION
    // ============================================
    const allMissions = await this.missionExpenseModel.find();
    const totalMissionsCount = allMissions.length;

    // Frais de mission payés avec répartition par devise
    const paidMissions = allMissions.filter(
      (mission) => mission.status === 'PAID',
    );
    const paidMissionsByCurrency = this.aggregateByCurrency(
      paidMissions,
      'montant',
      'devise',
    );
    const totalPaidMissionsAmount = this.calculateTotal(paidMissionsByCurrency);

    // Répartition des missions par statut
    const missionsByStatus = this.countByStatus(allMissions, 'status');

    // Missions par entreprise
    const missionsByCompany = allMissions.reduce(
      (acc: { [key: string]: number }, mission) => {
        const company = mission.entreprise || 'NON_DEFINI';
        acc[company] = (acc[company] || 0) + 1;
        return acc;
      },
      {},
    );

    // Missions par pays de destination
    const missionsByCountry = allMissions.reduce(
      (acc: { [key: string]: number }, mission) => {
        const country = mission.pays || 'NON_DEFINI';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      },
      {},
    );

    // Durée moyenne des missions (en jours)
    const averageMissionDays =
      totalMissionsCount > 0
        ? allMissions.reduce((sum, m) => sum + (m.nombreDeJours || 0), 0) /
          totalMissionsCount
        : 0;

    // ============================================
    // 3. STATISTIQUES DES HÔTELS
    // ============================================
    const allHotels = await this.hotelApartementModel.find();
    const totalHotelsCount = allHotels.length;

    // Dépenses hôtels avec répartition par devise
    const hotelExpensesByCurrency = this.aggregateByCurrency(
      allHotels,
      'totalAmount',
      'currency',
    );
    const totalHotelExpenses = this.calculateTotal(hotelExpensesByCurrency);

    // Répartition des hôtels par statut
    const hotelsByStatus = this.countByStatus(allHotels, 'status');

    // Hôtels par ville
    const hotelsByCity = allHotels.reduce(
      (acc: { [key: string]: number }, hotel) => {
        const city = hotel.ville || 'NON_DEFINI';
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      },
      {},
    );

    // Nombre moyen de nuits
    const averageHotelNights =
      totalHotelsCount > 0
        ? allHotels.reduce((sum, h) => sum + (h.numberOfNights || 0), 0) /
          totalHotelsCount
        : 0;

    // ============================================
    // 4. STATISTIQUES DES APPARTEMENTS MEUBLÉS
    // ============================================
    const allMeubles = await this.appartementMeubleModel.find();
    const totalMeublesCount = allMeubles.length;

    // Dépenses appartements meublés avec répartition par devise
    const meubleExpensesByCurrency = this.aggregateByCurrency(
      allMeubles,
      'totalAmount',
      'currency',
    );
    const totalMeubleExpenses = this.calculateTotal(meubleExpensesByCurrency);

    // Répartition par statut
    const meublesByStatus = this.countByStatus(allMeubles, 'status');

    // Nombre moyen de nuits
    const averageMeubleNights =
      totalMeublesCount > 0
        ? allMeubles.reduce((sum, m) => sum + (m.numberOfNights || 0), 0) /
          totalMeublesCount
        : 0;

    // ============================================
    // 5. STATISTIQUES DES APPARTEMENTS VIDES
    // ============================================
    const allVides = await this.appartementVideModel.find();
    const totalVidesCount = allVides.length;

    // Dépenses appartements vides avec répartition par devise (loyer mensuel)
    const videExpensesByCurrency = this.aggregateByCurrency(
      allVides,
      'monthlyRent',
      'currency',
    );
    const totalVideExpenses = this.calculateTotal(videExpensesByCurrency);

    // Caution totale par devise
    const videSecurityDepositByCurrency = this.aggregateByCurrency(
      allVides,
      'securityDeposit',
      'currency',
    );

    // Contrats actifs vs expirés
    const activeContracts = allVides.filter((vide) => {
      const endDate = new Date(vide.endDate);
      return endDate >= today;
    });

    const expiredContracts = allVides.filter((vide) => {
      const endDate = new Date(vide.endDate);
      return endDate < today;
    });

    // Contrats expirant bientôt (dans les 30 prochains jours)
    const expiringContacts = allVides.filter((vide) => {
      const endDate = new Date(vide.endDate);
      const daysUntilExpiry = Math.ceil(
        (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      return daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
    });

    // Répartition par type d'appartement
    const videsByType = allVides.reduce(
      (acc: { [key: string]: number }, vide) => {
        const type = vide.apartmentType || 'NON_DEFINI';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {},
    );

    // Répartition par statut
    const videsByStatus = this.countByStatus(allVides, 'status');

    // ============================================
    // 6. STATISTIQUES GLOBALES
    // ============================================

    // Total général des dépenses (tous types confondus)
    const totalAllExpenses =
      totalPaidTicketsAmount +
      totalPaidMissionsAmount +
      totalHotelExpenses +
      totalMeubleExpenses +
      totalVideExpenses;

    // Répartition globale des dépenses par catégorie
    const expenseDistribution = {
      billetsVoyage: {
        amount: totalPaidTicketsAmount,
        percentage:
          totalAllExpenses > 0
            ? ((totalPaidTicketsAmount / totalAllExpenses) * 100).toFixed(2)
            : '0',
      },
      fraisMission: {
        amount: totalPaidMissionsAmount,
        percentage:
          totalAllExpenses > 0
            ? ((totalPaidMissionsAmount / totalAllExpenses) * 100).toFixed(2)
            : '0',
      },
      hotels: {
        amount: totalHotelExpenses,
        percentage:
          totalAllExpenses > 0
            ? ((totalHotelExpenses / totalAllExpenses) * 100).toFixed(2)
            : '0',
      },
      appartementsMeubles: {
        amount: totalMeubleExpenses,
        percentage:
          totalAllExpenses > 0
            ? ((totalMeubleExpenses / totalAllExpenses) * 100).toFixed(2)
            : '0',
      },
      appartementsVides: {
        amount: totalVideExpenses,
        percentage:
          totalAllExpenses > 0
            ? ((totalVideExpenses / totalAllExpenses) * 100).toFixed(2)
            : '0',
      },
    };

    // Top 5 des entreprises par dépenses (billets payés)
    const companyTicketExpenses = paidTickets.reduce(
      (acc: { [key: string]: number }, ticket) => {
        const company = ticket.entreprise || 'NON_DEFINI';
        acc[company] = (acc[company] || 0) + (ticket.prixBilletAvion || 0);
        return acc;
      },
      {},
    );
    const topCompaniesExpenses = Object.entries(companyTicketExpenses)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([company, amount]) => ({ company, amount }));

    // ============================================
    // RETOUR DES DONNÉES DU TABLEAU DE BORD
    // ============================================
    return {
      // Résumé rapide
      summary: {
        totalTickets: totalTicketsCount,
        totalMissions: totalMissionsCount,
        totalHotels: totalHotelsCount,
        totalAppartementsMeubles: totalMeublesCount,
        totalAppartementsVides: totalVidesCount,
        totalExpenses: totalAllExpenses,
      },

      // Billets de voyage
      travelTickets: {
        totalCount: totalTicketsCount,
        paidCount: paidTickets.length,
        totalPaidAmount: totalPaidTicketsAmount,
        paidAmountByCurrency: paidTicketsByCurrency,
        byStatus: ticketsByStatus,
        byCompany: ticketsByCompany,
        byClass: ticketsByClass,
      },

      // Frais de mission
      missionExpenses: {
        totalCount: totalMissionsCount,
        paidCount: paidMissions.length,
        totalPaidAmount: totalPaidMissionsAmount,
        paidAmountByCurrency: paidMissionsByCurrency,
        byStatus: missionsByStatus,
        byCompany: missionsByCompany,
        byCountry: missionsByCountry,
        averageDurationDays: Math.round(averageMissionDays * 10) / 10,
      },

      // Hôtels
      hotels: {
        totalCount: totalHotelsCount,
        totalExpenses: totalHotelExpenses,
        expensesByCurrency: hotelExpensesByCurrency,
        byStatus: hotelsByStatus,
        byCity: hotelsByCity,
        averageNights: Math.round(averageHotelNights * 10) / 10,
      },

      // Appartements meublés
      appartementsMeubles: {
        totalCount: totalMeublesCount,
        totalExpenses: totalMeubleExpenses,
        expensesByCurrency: meubleExpensesByCurrency,
        byStatus: meublesByStatus,
        averageNights: Math.round(averageMeubleNights * 10) / 10,
      },

      // Appartements vides
      appartementsVides: {
        totalCount: totalVidesCount,
        totalMonthlyRent: totalVideExpenses,
        monthlyRentByCurrency: videExpensesByCurrency,
        securityDepositByCurrency: videSecurityDepositByCurrency,
        activeContractsCount: activeContracts.length,
        expiredContractsCount: expiredContracts.length,
        expiringWithin30DaysCount: expiringContacts.length,
        byType: videsByType,
        byStatus: videsByStatus,
      },

      // Analyse des dépenses globales
      globalExpensesAnalysis: {
        totalAllExpenses: totalAllExpenses,
        distribution: expenseDistribution,
        topCompaniesExpenses: topCompaniesExpenses,
      },

      // Alertes et indicateurs clés
      alerts: {
        expiredContracts: expiredContracts.length,
        contractsExpiringWithin30Days: expiringContacts.length,
        pendingTickets: ticketsByStatus['SUBMITTED'] || 0,
        pendingMissions:
          (missionsByStatus['DRAFT'] || 0) +
          (missionsByStatus['SUBMITTED'] || 0),
        pendingHotels: hotelsByStatus['RESERVE'] || 0,
        pendingMeubles: meublesByStatus['PENDING'] || 0,
      },

      // Métadonnées
      metadata: {
        generatedAt: today.toISOString(),
        currency: 'Multi-devises (voir détails par section)',
      },
    };
  }
}
