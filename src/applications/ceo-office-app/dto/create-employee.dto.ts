import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMembreFamilleDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  prenom: string;

  @IsString()
  @IsNotEmpty()
  lien: string;

  @IsOptional()
  dateNaissance?: Date;

  @IsOptional()
  @IsString()
  telephone?: string;
}

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  prenom: string;

  @IsString()
  @IsNotEmpty()
  matricule: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;

  @IsString()
  @IsEnum(['M', 'F', 'Autre'])
  sexe: string;

  @IsString()
  @IsNotEmpty()
  entreprise: string;

  @IsString()
  @IsNotEmpty()
  fonction: string;

  @IsString()
  @IsNotEmpty()
  departement: string;

  @IsString()
  @IsEnum(['actif', 'inactif', 'en_conge', 'suspendu'])
  @IsOptional()
  statut?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMembreFamilleDto)
  @IsOptional()
  membreFamille?: CreateMembreFamilleDto[];
}
