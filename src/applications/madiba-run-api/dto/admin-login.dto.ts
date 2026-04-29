/**
 * =============================================================================
 * DTO DE CONNEXION ADMIN - MADIBA RUN
 * =============================================================================
 * 
 * Ce DTO définit la structure et les validations pour la connexion
 * des administrateurs à la plateforme Madiba Run.
 * 
 * @author API UCB Connect
 * @version 1.0.0
 */

import { 
  IsEmail, 
  IsNotEmpty, 
  MinLength,
  MaxLength,
  IsString
} from 'class-validator';

export class AdminLoginDto {
  
  /**
   * Adresse email de l'administrateur (identifiant unique)
   * @example admin@madibarun.cm
   */
  @IsNotEmpty({ message: 'L\'email est obligatoire' })
  @IsEmail({}, { message: 'Format d\'email invalide' })
  @MaxLength(255, { message: 'L\'email ne doit pas dépasser 255 caractères' })
  email!: string;

  /**
   * Mot de passe de l'administrateur (minimum 8 caractères)
   * @example MotDePasse123!
   */
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  password!: string;
}
