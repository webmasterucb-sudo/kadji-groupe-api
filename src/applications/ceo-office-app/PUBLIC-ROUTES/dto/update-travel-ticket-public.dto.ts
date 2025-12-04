import { PartialType } from '@nestjs/mapped-types';
import { CreateTravelTicketPublicDto } from './create-travel-ticket-public.dto';

export class UpdateTravelTicketPublicDto extends PartialType(CreateTravelTicketPublicDto) { }
