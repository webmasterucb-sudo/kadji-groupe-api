import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsDateString,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  Sexe,
  PointDepart,
  Distance,
  Categorie,
} from '../entities/participant.entity';

export class CreateParticipantDto {
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  @MaxLength(100, { message: 'Le nom ne peut pas dépasser 100 caractères' })
  nom!: string;

  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le prénom est obligatoire' })
  @MinLength(2, { message: 'Le prénom doit contenir au moins 2 caractères' })
  @MaxLength(100, { message: 'Le prénom ne peut pas dépasser 100 caractères' })
  prenom!: string;

  @IsEnum(Sexe, {
    message: 'Le sexe doit être HOMME ou FEMME',
  })
  @IsNotEmpty({ message: 'Le sexe est obligatoire' })
  sexe!: Sexe;

  @IsDateString({}, { message: 'La date de naissance doit être une date valide' })
  @IsNotEmpty({ message: 'La date de naissance est obligatoire' })
  dateNaissance!: Date;

  @IsString({ message: 'Le téléphone doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le téléphone est obligatoire' })
  @Matches(/^\+?[0-9]{9,15}$/, {
    message: 'Le numéro de téléphone doit être valide (ex: +237677554433)',
  })
  telephone!: string;

  @IsEmail({}, { message: 'L\'adresse email doit être valide' })
  @IsNotEmpty({ message: 'L\'email est obligatoire' })
  email!: string;

  @IsEnum(PointDepart, {
    message: 'Le point de départ doit être une valeur valide',
  })
  @IsNotEmpty({ message: 'Le point de départ est obligatoire' })
  pointDepart!: PointDepart;

  @IsString({ message: 'Le quartier doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le quartier est obligatoire' })
  @MaxLength(100, { message: 'Le quartier ne peut pas dépasser 100 caractères' })
  quartier!: string;

  @IsEnum(Distance, {
    message: 'La distance à parcourir doit être 5km, 10km, 21km ou 42km',
  })
  @IsNotEmpty({ message: 'La distance à parcourir est obligatoire' })
  distanceParcourir!: Distance;

  @IsEnum(Categorie, {
    message: 'La catégorie doit être une valeur valide (WALKATHON, MARATHON, etc.)',
  })
  @IsNotEmpty({ message: 'La catégorie est obligatoire' })
  categorie!: Categorie;

  @IsOptional()
  @IsString({ message: 'Le lien du certificat médical doit être une chaîne de caractères' })
  lienCertificatMedical?: string;

  @IsOptional()
  @IsString({ message: 'Le contact d\'urgence doit être une chaîne de caractères' })
  @Matches(/^\+?[0-9]{9,15}$/, {
    message: 'Le numéro de contact d\'urgence doit être valide',
  })
  contactUrgence?: string;

  @IsOptional()
  @IsString({ message: 'Le nom du contact d\'urgence doit être une chaîne de caractères' })
  @MaxLength(200, { message: 'Le nom du contact d\'urgence ne peut pas dépasser 200 caractères' })
  nomContactUrgence?: string;

  @IsOptional()
  @IsString({ message: 'Les notes doivent être une chaîne de caractères' })
  @MaxLength(500, { message: 'Les notes ne peuvent pas dépasser 500 caractères' })
  notes?: string;
}
