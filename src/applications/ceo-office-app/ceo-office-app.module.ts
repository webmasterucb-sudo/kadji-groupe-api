
// src/travel-tickets/travel-tickets.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TravelTicketsController } from './ceo-office-app.controller';
import { TravelTicketsService } from './ceo-office-app.service';
import { TravelTicket, TravelTicketSchema } from './entities/ceo-office-app.entity';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { Employee, EmployeeSchema } from './entities/employee.entity';
import { MissionExpensesController } from './mission-expenses.controller';
import { MissionExpensesService } from './mission-expenses.service';
import { MissionExpense, MissionExpenseSchema } from './entities/mission-expense.entity';
import { HotelApartementController } from './hotel-apartement.controller';
import { HotelApartementService } from './hotel-apartement.service';
import { HotelApartement, HotelApartementSchema } from './entities/hotel-apartement.entity';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TravelTicket.name, schema: TravelTicketSchema },
      { name: Employee.name, schema: EmployeeSchema },
      { name: MissionExpense.name, schema: MissionExpenseSchema },
      { name: HotelApartement.name, schema: HotelApartementSchema },
    ])
  ],
  controllers: [TravelTicketsController, EmployeeController, MissionExpensesController, HotelApartementController],
  providers: [TravelTicketsService, EmployeeService, MissionExpensesService, HotelApartementService],
})
export class CeoCoreModule { }