import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TravelTicketPublicController } from './travel-ticket-public.controller';
import { TravelTicketPublicService } from './travel-ticket-public.service';
import { TravelTicket, TravelTicketSchema } from '../entities/ceo-office-app.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: TravelTicket.name, schema: TravelTicketSchema },
        ]),
    ],
    controllers: [TravelTicketPublicController],
    providers: [TravelTicketPublicService],
    exports: [TravelTicketPublicService],
})
export class PublicRoutesModule { }
