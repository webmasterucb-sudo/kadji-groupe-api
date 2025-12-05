import { IsString, IsNotEmpty, MinLength, Matches, IsDate, IsEnum, IsOptional } from 'class-validator';

export class CreateTravelTicketPublicDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    nom: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    prenom: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[A-Z0-9]+$/)
    matricule: string;

    @IsString()
    @IsNotEmpty()
    entreprise: string;

    @IsString()
    @IsNotEmpty()
    departement: string;

    @IsString()
    @IsNotEmpty()
    fonction: string;

    @IsString()
    @IsNotEmpty()
    motifVoyage: string;

    @IsString()
    @IsNotEmpty()
    projet: string;

    @IsDate()
    @IsNotEmpty()
    dateDepart: Date;

    @IsDate()
    @IsNotEmpty()
    dateRetour: Date;

    @IsString()
    @IsOptional()
    emailValidateur?: string;

    @IsString()
    @IsEnum(['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'PAID'])
    @IsOptional()
    status?: string;
}
