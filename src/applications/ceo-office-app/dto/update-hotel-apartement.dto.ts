import { PartialType } from '@nestjs/mapped-types';
import { CreateHotelApartementDto } from './create-hotel-apartement.dto';

export class UpdateHotelApartementDto extends PartialType(CreateHotelApartementDto) { }
