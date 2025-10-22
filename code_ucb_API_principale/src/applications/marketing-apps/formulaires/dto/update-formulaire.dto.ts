import { PartialType } from '@nestjs/mapped-types';
import { ContactFormDto, } from './create-formulaire.dto';

export class UpdateFormulaireDto extends PartialType(ContactFormDto) {}
