import { IsString, IsNotEmpty, MinLength, MaxLength, IsUrl, IsEnum, isNotEmpty, IsDate, IsEmail, IsNumber, IsOptional } from 'class-validator';

export class CreateUsersDto {

    @IsString()
    @IsNotEmpty()
    readonly nom: string;

    @IsString()
    @IsNotEmpty()
    readonly prenom: string;

    @IsString()
    @IsNotEmpty()
    readonly sexe: string;

    @IsString()
    @IsNotEmpty()
    readonly phone: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsOptional() // Rend le champ optionnel
    readonly message?: string;

    @IsNumber()
    @IsOptional()
    readonly nbrScan?: number;

    @IsString()
    @IsOptional()
    readonly profilUser?: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4) // Exemple : code d'accès d'au moins 4 caractères
    readonly codeAcces: string;

    @IsString()
    @IsOptional()
    readonly statutCompte?: string;

    @IsDate()
    @IsOptional()
    readonly lastConnectedDate?: Date;

}
