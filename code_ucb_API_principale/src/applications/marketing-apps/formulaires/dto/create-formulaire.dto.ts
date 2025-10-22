
import { IsString, IsNotEmpty, MinLength, MaxLength, IsUrl, IsEnum, IsEmail } from 'class-validator';

export class ContactFormDto {
  @IsString({ message: 'Le lien de l\'image doit être un URL valide' })
  @IsNotEmpty({ message: 'Le lien de l\'image est requis' })
  @MaxLength(200, { message: 'Le titre ne peut pas dépasser 500 caractères' })
  nom: string;

  @IsString()
  @IsNotEmpty({ message: 'Le titre est requis' })
  @MinLength(3, { message: 'Le titre doit contenir au moins 5 caractères' })
  @MaxLength(200, { message: 'Le titre ne peut pas dépasser 500 caractères' })
  prenom: string;

  @IsString()
  @IsNotEmpty({ message: 'Le titre est requis' })
  @MinLength(8, { message: 'Le titre doit contenir au moins 5 caractères' })
  @MaxLength(100, { message: 'Le titre ne peut pas dépasser 500 caractères' })
  phone: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Le titre est requis' })
  @MinLength(5, { message: 'Le titre doit contenir au moins 5 caractères' })
  @MaxLength(100, { message: 'Le titre ne peut pas dépasser 500 caractères' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La description est requise' })
  @MinLength(12, { message: 'La description doit contenir au moins 50 caractères' })
  @MaxLength(6000, { message: 'La description ne peut pas dépasser 6000 caractères' })
  message: string; 

  @IsEnum(['homme', 'femme'], { message: 'Type d\'article invalide' })
  @IsNotEmpty({ message: 'Le type d\'article est requis' }) 
  sexe: string;

} 
