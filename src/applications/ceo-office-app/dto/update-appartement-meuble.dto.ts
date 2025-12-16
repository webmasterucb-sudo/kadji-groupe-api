import { PartialType } from '@nestjs/mapped-types';
import { CreateAppartementMeubleDto } from './create-appartement-meuble.dto';

export class UpdateAppartementMeubleDto extends PartialType(
  CreateAppartementMeubleDto,
) {}
