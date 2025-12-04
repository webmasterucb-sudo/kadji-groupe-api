import { PartialType } from '@nestjs/mapped-types';
import { CreateAppartementVideDto } from './create-appartement-vide.dto';

export class UpdateAppartementVideDto extends PartialType(CreateAppartementVideDto) { }
