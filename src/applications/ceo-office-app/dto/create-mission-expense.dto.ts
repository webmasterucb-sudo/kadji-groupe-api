import { IsString, IsNumber, IsEnum, IsOptional, IsDateString } from 'class-validator';

export class CreateMissionExpenseDto {
    @IsString()
    nom: string;

    @IsString()
    prenom: string;

    @IsString()
    matricule: string;

    @IsString()
    entreprise: string;

    @IsString()
    departement: string;

    @IsString()
    pays: string;

    @IsNumber()
    nombreDeJours: number;

    @IsString()
    devise: string;

    @IsNumber()
    montant: number;

    @IsString()
    motif: string;

    @IsEnum(['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'PAID'])
    @IsOptional()
    status?: string;

    @IsDateString()
    @IsOptional()
    submittedAt?: string;

    @IsDateString()
    @IsOptional()
    approvedAt?: string;

    @IsString()
    @IsOptional()
    approvedById?: string;

    @IsString()
    createdById: string;
}
