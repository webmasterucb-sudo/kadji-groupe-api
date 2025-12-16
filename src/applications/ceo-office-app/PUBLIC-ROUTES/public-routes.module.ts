import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TravelTicketPublicController } from './travel-ticket-public.controller';
import { TravelTicketPublicService } from './travel-ticket-public.service';
import { MailModule } from 'src/core/mail/mail.module';
import { HotelApartementController } from './hotel-apartement.controller';
import { HotelApartementService } from './hotel-apartement.service';
import {
  HotelApartement,
  HotelApartementSchema,
} from '../entities/hotel-apartement.entity';
import {
  TravelTicket,
  TravelTicketSchema,
} from '../entities/ceo-office-app.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TravelTicket.name, schema: TravelTicketSchema },
      { name: HotelApartement.name, schema: HotelApartementSchema },
    ]),
    MailModule,
  ],
  controllers: [TravelTicketPublicController, HotelApartementController],
  providers: [TravelTicketPublicService, HotelApartementService],
  exports: [TravelTicketPublicService, HotelApartementService],
})
export class PublicRoutesModule {}
