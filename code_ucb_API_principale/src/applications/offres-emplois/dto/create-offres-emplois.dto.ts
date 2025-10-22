// export class CreateOffresEmploisDto {}


// =====================================================
// 2. DTO (Data Transfer Objects)
// =====================================================

// create-job-offer.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsEnum, IsBoolean, IsUrl, IsDateString, Min } from 'class-validator';

export class CreateJobOfferDto {
    @IsString({ message: 'Le titre doit être une chaîne de caractères' })
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString({ message: 'Le département doit être une chaîne de caractères' })
    @IsNotEmpty()
    departement: string;

    @IsString()
    @IsNotEmpty()
    niveauEtude: string;

    @IsString()
    @IsNotEmpty()
    lieuxTravail: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    salaire?: number;

    @IsEnum(['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance'])
    contractType: string;

    // @IsArray()
    @IsString({ each: true })
    experience: string;

    // @IsArray()
    @IsString({ each: true })
    skills: string;

    @IsOptional()
    // @IsArray()
    @IsString({ each: true }) 
    benefits?: string;

    // @IsArray()
    @IsString({ each: true })
    requirements: string;

    @IsOptional()
    @IsDateString()
    applicationDeadline?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsUrl()
    @IsOptional()
    linkToApply: string;
}

