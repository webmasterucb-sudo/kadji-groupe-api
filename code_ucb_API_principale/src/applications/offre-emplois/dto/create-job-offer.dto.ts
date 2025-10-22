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
 * DTO pour les informations de salaire
 */
export class CreateSalaryDto {
    @IsNumber({}, { message: 'Le salaire minimum doit être un nombre' })
    @Min(0, { message: 'Le salaire minimum doit être positif' })
    min: number;

    @IsNumber({}, { message: 'Le salaire maximum doit être un nombre' })
    @Min(0, { message: 'Le salaire maximum doit être positif' })
    max: number;

    @IsString({ message: 'La devise doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'La devise est requise' })
    @MaxLength(3, { message: 'La devise ne peut pas dépasser 3 caractères' })
    @Transform(({ value }) => value?.toUpperCase())
    currency: string = 'EUR';
}

/**
 * DTO pour créer une nouvelle offre d'emploi
 */
export class CreateJobOfferDto {
    @IsString({ message: 'Le titre doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le titre est requis' })
    @MinLength(5, { message: 'Le titre doit contenir au moins 5 caractères' })
    @MaxLength(200, { message: 'Le titre ne peut pas dépasser 200 caractères' })
    @Transform(({ value }) => value?.trim())
    title: string;

    @IsString({ message: 'La description doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'La description est requise' })
    @MinLength(50, { message: 'La description doit contenir au moins 50 caractères' })
    @MaxLength(5000, { message: 'La description ne peut pas dépasser 5000 caractères' })
    @Transform(({ value }) => value?.trim())
    description: string;

    @IsString({ message: 'Le nom de l\'entreprise doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le nom de l\'entreprise est requis' })
    @MaxLength(100, { message: 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères' })
    @Transform(({ value }) => value?.trim())
    company: string;

    @IsString({ message: 'La localisation doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'La localisation est requise' })
    @MaxLength(100, { message: 'La localisation ne peut pas dépasser 100 caractères' })
    @Transform(({ value }) => value?.trim())
    location: string;

    @IsOptional()
    @ValidateNested({ message: 'Les informations de salaire ne sont pas valides' })
    @Type(() => CreateSalaryDto)
    salary?: CreateSalaryDto;

    @IsEnum(['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance'], {
        message: 'Le type de contrat doit être: CDI, CDD, Stage, Freelance ou Alternance'
    })
    contractType: ContractType;

    @IsEnum(['Junior', 'Confirmé', 'Senior', 'Expert'], {
        message: 'Le niveau d\'expérience doit être: Junior, Confirmé, Senior ou Expert'
    })
    experience: ExperienceLevel;

    @IsArray({ message: 'Les compétences doivent être un tableau' })
    @ArrayMinSize(1, { message: 'Au moins une compétence est requise' })
    @IsString({ each: true, message: 'Chaque compétence doit être une chaîne de caractères' })
    @IsNotEmpty({ each: true, message: 'Les compétences ne peuvent pas être vides' })
    @Transform(({ value }) =>
        Array.isArray(value)
            ? value.map((skill: string) => skill?.trim()).filter(Boolean)
            : value
    )
    skills: string[];

    @IsOptional()
    @IsArray({ message: 'Les avantages doivent être un tableau' })
    @IsString({ each: true, message: 'Chaque avantage doit être une chaîne de caractères' })
    @IsNotEmpty({ each: true, message: 'Les avantages ne peuvent pas être vides' })
    @Transform(({ value }) =>
        Array.isArray(value)
            ? value.map((benefit: string) => benefit?.trim()).filter(Boolean)
            : value
    )
    benefits?: string[];

    @IsArray({ message: 'Les exigences doivent être un tableau' })
    @ArrayMinSize(1, { message: 'Au moins une exigence est requise' })
    @IsString({ each: true, message: 'Chaque exigence doit être une chaîne de caractères' })
    @IsNotEmpty({ each: true, message: 'Les exigences ne peuvent pas être vides' })
    @Transform(({ value }) =>
        Array.isArray(value)
            ? value.map((req: string) => req?.trim()).filter(Boolean)
            : value
    )
    requirements: string[];

    @IsOptional()
    @IsDateString({}, { message: 'La date limite de candidature doit être une date valide (ISO 8601)' })
    applicationDeadline?: string;

  @IsOptional()
  @IsBoolean({ message: 'Le statut actif doit être un booléen' })
  isActive?: boolean = true;

  @IsOptional()
  @IsNumber({}, { message: 'Le nombre total de postulants doit être un nombre' })
  @Min(0, { message: 'Le nombre total de postulants doit être positif ou nul' })
  totalPostuleNumber?: number = 0;
}
