// src/travel-tickets/dto/update-travel-ticket.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateTravelTicketDto } from './create-ceo-office-app.dto';


export class UpdateTravelTicketDto extends PartialType(CreateTravelTicketDto) {}