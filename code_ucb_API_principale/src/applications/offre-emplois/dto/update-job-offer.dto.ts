import { PartialType } from '@nestjs/mapped-types';
import { CreateJobOfferDto, CreateSalaryDto } from './create-job-offer.dto';
import { 
  IsString, 
  IsNotEmpty, 
  IsEnum, 
  IsArray, 
  IsOptional, 
  IsBoolean, 
  IsDateString, 
  ValidateNested, 
  ArrayMinSize,
  MaxLength,
  MinLength,
  IsNumber,
  Min
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ContractType, ExperienceLevel } from '../interfaces/job-offer.interface';

/**
 * DTO pour la mise à jour des informations de salaire
 */
export class UpdateSalaryDto {
  @IsOptional()
  @IsNumber({}, { message: 'Le salaire minimum doit être un nombre' })
  @Min(0, { message: 'Le salaire minimum doit être positif' })
  min?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Le salaire maximum doit être un nombre' })
  @Min(0, { message: 'Le salaire maximum doit être positif' })
  max?: number;

  @IsOptional()
  @IsString({ message: 'La devise doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'La devise est requise' })
  @MaxLength(3, { message: 'La devise ne peut pas dépasser 3 caractères' })
  @Transform(({ value }) => value?.toUpperCase())
  currency?: string;
}

/**
 * DTO pour la mise à jour d'une offre d'emploi
 * Utilise PartialType pour rendre tous les champs optionnels
 */
export class UpdateJobOfferDto extends PartialType(CreateJobOfferDto) {}


