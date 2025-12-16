// src/travel-tickets/travel-tickets.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TravelTicketsController } from './ceo-office-app.controller';
import { TravelTicketsService } from './ceo-office-app.service';
import {
  TravelTicket,
  TravelTicketSchema,
} from './entities/ceo-office-app.entity';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { Employee, EmployeeSchema } from './entities/employee.entity';
import { MissionExpensesController } from './mission-expenses.controller';
import { MissionExpensesService } from './mission-expenses.service';
import {
  MissionExpense,
  MissionExpenseSchema,
} from './entities/mission-expense.entity';
import { HotelApartementController } from './hotel-apartement.controller';
import { HotelApartementService } from './hotel-apartement.service';
import {
  HotelApartement,
  HotelApartementSchema,
} from './entities/hotel-apartement.entity';
import { AppartementMeubleController } from './appartement-meuble.controller';
import { AppartementMeubleService } from './appartement-meuble.service';
import {
  AppartementMeuble,
  AppartementMeubleSchema,
} from './entities/appartement-meuble.entity';
import { AppartementVideController } from './appartement-vide.controller';
import { AppartementVideService } from './appartement-vide.service';
import {
  AppartementVide,
  AppartementVideSchema,
} from './entities/appartement-vide.entity';
import { PublicRoutesModule } from './PUBLIC-ROUTES/public-routes.module';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { UsersParametresModule } from './PARAMETRES-ROUTES/users-parametres.module';
import { EntrepriseModule } from './PARAMETRES-ROUTES/entreprise.module';
import { ValidateurEmailModule } from './PARAMETRES-ROUTES/validateur-email.module';
import { HotelParametreModule } from './PARAMETRES-ROUTES/hotel-parametre.module';
import { FournisseurBilletModule } from './PARAMETRES-ROUTES/fournisseur-billet.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TravelTicket.name, schema: TravelTicketSchema },
      { name: Employee.name, schema: EmployeeSchema },
      { name: MissionExpense.name, schema: MissionExpenseSchema },
      { name: HotelApartement.name, schema: HotelApartementSchema },
      { name: AppartementMeuble.name, schema: AppartementMeubleSchema },
      { name: AppartementVide.name, schema: AppartementVideSchema },
    ]),
    PublicRoutesModule,
    UsersParametresModule,
    EntrepriseModule,
    ValidateurEmailModule,
    HotelParametreModule,
    FournisseurBilletModule,
  ],
  controllers: [
    TravelTicketsController,
    EmployeeController,
    MissionExpensesController,
    HotelApartementController,
    AppartementMeubleController,
    AppartementVideController,
    DashboardController,
  ],
  providers: [
    TravelTicketsService,
    EmployeeService,
    MissionExpensesService,
    HotelApartementService,
    AppartementMeubleService,
    AppartementVideService,
    DashboardService,
  ],
})
export class CeoCoreModule {}
