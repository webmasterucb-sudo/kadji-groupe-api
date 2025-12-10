import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEntrepriseDto {
    @IsNotEmpty({ message: 'Le nom de l\'entreprise est obligatoire' })
    @IsString()
    nom: string;

    @IsOptional()
    @IsString()
    telephone?: string;

    @IsOptional()
    @IsEmail({}, { message: 'L\'email est invalide' })
    email?: string;

    @IsOptional()
    @IsString()
    adresse?: string;

    @IsNotEmpty({ message: 'Le statut est obligatoire' })
    @IsEnum(['INTERNE', 'EXTERNE'], { message: 'Le statut doit être INTERNE ou EXTERNE' })
    status: 'INTERNE' | 'EXTERNE';
}
