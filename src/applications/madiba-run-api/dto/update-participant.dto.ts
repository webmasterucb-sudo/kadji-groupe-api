import { PartialType } from '@nestjs/mapped-types';
import { CreateParticipantDto } from './create-participant.dto';
import { IsEnum, IsOptional, IsBoolean, IsDateString, IsString } from 'class-validator';
import { StatutParticipant } from '../entities/participant.entity';

export class UpdateParticipantDto extends PartialType(CreateParticipantDto) {
  @IsOptional()
  @IsEnum(StatutParticipant, {
    message: 'Le statut doit être une valeur valide',
  })
  statut?: StatutParticipant;

  @IsOptional()
  @IsString({ message: 'Le numéro de dossard doit être une chaîne de caractères' })
  numeroDossard?: string;

  @IsOptional()
  @IsBoolean({ message: 'smsEnvoye doit être un booléen' })
  smsEnvoye?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'emailEnvoye doit être un booléen' })
  emailEnvoye?: boolean;

  @IsOptional()
  @IsDateString({}, { message: 'La date de validation doit être une date valide' })
  dateValidation?: Date;
}
