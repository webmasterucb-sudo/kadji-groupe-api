import { PartialType } from '@nestjs/mapped-types';
import { CreateHotelParametreDto } from './create-hotel-parametre.dto';

export class UpdateHotelParametreDto extends PartialType(CreateHotelParametreDto) { }
