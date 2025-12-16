import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TravelTicket } from '../entities/ceo-office-app.entity';
import { MissionExpense } from '../entities/mission-expense.entity';
import { HotelApartement } from '../entities/hotel-apartement.entity';
import { AppartementMeuble } from '../entities/appartement-meuble.entity';
import { AppartementVide } from '../entities/appartement-vide.entity';

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

  async getDashboardData() {
    // 1. Billets Enregistrés
    const totalTickets = await this.travelTicketModel.countDocuments();

    // 2. Voyages Entreprise (Assuming MissionExpense represents trips or TravelTicket represents trips)
    // The image says "Voyages Entreprise" 89. "Billets Enregistrés" 247.
    // Maybe "Voyages Entreprise" is distinct from "Billets".
    // Let's use MissionExpense count for "Voyages Entreprise" as a proxy if it makes sense,
    // or maybe TravelTicket where status is 'APPROVED' or 'PAID'.
    // Let's use MissionExpense count for now as per plan.
    const corporateTrips = await this.missionExpenseModel.countDocuments();

    // 3. Frais de Mission
    const missionExpenses = await this.missionExpenseModel.find();
    const totalMissionExpenses = missionExpenses.reduce(
      (sum, expense) => sum + (expense.montant || 0),
      0,
    );

    // 4. Hôtels
    const activeHotels = await this.hotelApartementModel.countDocuments({
      status: { $in: ['RESERVE', 'CONFIRME'] },
    });

    // 5. Appart. Vides
    const emptyApartments = await this.appartementVideModel.countDocuments();

    // 6. Appart. Meublés
    const furnishedApartments =
      await this.appartementMeubleModel.countDocuments({ status: 'CONFIRMED' });

    // 7. Dépenses Total (Hébergement)
    // Sum of Hotel + Meuble + Vide expenses
    const hotels = await this.hotelApartementModel.find();
    const totalHotelExpenses = hotels.reduce(
      (sum, hotel) => sum + (hotel.totalAmount || 0),
      0,
    );

    const meubles = await this.appartementMeubleModel.find();
    const totalMeubleExpenses = meubles.reduce(
      (sum, meuble) => sum + (meuble.totalAmount || 0),
      0,
    );

    const vides = await this.appartementVideModel.find();
    // For Vide, it's monthly rent. Assuming we want the total value of contracts or just one month?
    // Let's sum monthlyRent for now.
    const totalVideExpenses = vides.reduce(
      (sum, vide) => sum + (vide.monthlyRent || 0),
      0,
    );

    const totalAccommodationExpenses =
      totalHotelExpenses + totalMeubleExpenses + totalVideExpenses;

    // 8. Taux d'Occupation
    // Mocking this for now as we don't have total capacity
    const occupancyRate = 85;

    return {
      tickets: {
        count: totalTickets,
        label: 'Billets Enregistrés',
        subLabel: 'Total des billets de voyage',
        trend: '+12% ce mois', // Mock trend
      },
      corporateTrips: {
        count: corporateTrips,
        label: 'Voyages Entreprise',
        subLabel: 'Voyages professionnels',
        trend: '+8% ce mois',
      },
      missionExpenses: {
        amount: totalMissionExpenses,
        label: 'Frais de Mission',
        subLabel: 'Montant total des frais',
        trend: '+15% ce mois',
      },
      hotels: {
        count: activeHotels,
        label: 'Hôtels',
        subLabel: 'Réservations actives',
        status: 'Stable',
      },
      emptyApartments: {
        count: emptyApartments,
        label: 'Appart. Vides',
        subLabel: 'Appartements non meublés',
        status: 'Stable',
      },
      furnishedApartments: {
        count: furnishedApartments,
        label: 'Appart. Meublés',
        subLabel: 'Appartements occupés',
        trend: '+5% ce mois',
      },
      totalAccommodationExpenses: {
        amount: totalAccommodationExpenses,
        label: 'Dépenses Total',
        subLabel: 'Total hébergement',
        trend: '+9% ce mois',
      },
      occupancyRate: {
        rate: occupancyRate,
        label: "Taux d'Occupation",
        subLabel: 'Occupation moyenne',
        trend: '+3% ce mois',
      },
      expensesByType: {
        meubles: totalMeubleExpenses,
        vides: totalVideExpenses,
        hotels: totalHotelExpenses,
      },
      monthlyPerformance: {
        occupancyRate: occupancyRate,
        missionsCompleted: 92, // Mock
        budgetUsed: 73, // Mock
      },
    };
  }
}
