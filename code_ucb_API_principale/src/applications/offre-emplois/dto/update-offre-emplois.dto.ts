import { PartialType } from '@nestjs/mapped-types';
import { CreateOffreEmploisDto } from './create-offre-emplois.dto';

export class UpdateOffreEmploisDto extends PartialType(CreateOffreEmploisDto) {}
