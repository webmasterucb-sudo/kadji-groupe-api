import { PartialType } from '@nestjs/mapped-types';
import { CreateValidateurEmailDto } from './create-validateur-email.dto';

export class UpdateValidateurEmailDto extends PartialType(
  CreateValidateurEmailDto,
) {}
