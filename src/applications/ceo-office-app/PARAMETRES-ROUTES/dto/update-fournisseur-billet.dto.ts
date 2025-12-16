import { PartialType } from '@nestjs/mapped-types';
import { CreateFournisseurBilletDto } from './create-fournisseur-billet.dto';

export class UpdateFournisseurBilletDto extends PartialType(
  CreateFournisseurBilletDto,
) {}
