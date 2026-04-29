/**
 * =============================================================================
 * DTO DE MISE À JOUR ADMIN - MADIBA RUN
 * =============================================================================
 * 
 * Ce DTO définit la structure et les validations pour la mise à jour
 * des informations d'un administrateur existant.
 * 
 * Tous les champs sont optionnels - seuls les champs fournis seront mis à jour.
 * 
 * @author API UCB Connect
 * @version 1.0.0
 */

import { 
  MinLength,
  MaxLength,
  IsString,
  IsEnum,
  IsOptional,
  Matches,
  IsNotEmpty
} from 'class-validator';
import { AdminRole, AdminStatus } from '../entities/admin.entity';

export class UpdateAdminDto {
  
  /**
   * Nom de famille de l'administrateur
   * @example Kamga
   */
  @IsOptional()
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @MaxLength(100, { message: 'Le nom ne doit pas dépasser 100 caractères' })
  nom?: string;

  /**
   * Prénom de l'administrateur
   * @example Jean-Pierre
   */
  @IsOptional()
  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  @MaxLength(100, { message: 'Le prénom ne doit pas dépasser 100 caractères' })
  prenom?: string;

  /**
   * Numéro de téléphone
   * @example +237 690 123 456
   */
  @IsOptional()
  @IsString({ message: 'Le téléphone doit être une chaîne de caractères' })
  @MaxLength(20, { message: 'Le téléphone ne doit pas dépasser 20 caractères' })
  telephone?: string;

  /**
   * Rôle de l'administrateur
   */
  @IsOptional()
  @IsEnum(AdminRole, { 
    message: `Le rôle doit être l'une des valeurs suivantes: ${Object.values(AdminRole).join(', ')}` 
  })
  role?: AdminRole;

  /**
   * Statut du compte administrateur
   */
  @IsOptional()
  @IsEnum(AdminStatus, { 
    message: `Le statut doit être l'une des valeurs suivantes: ${Object.values(AdminStatus).join(', ')}` 
  })
  status?: AdminStatus;
}

/**
 * =============================================================================
 * DTO DE CHANGEMENT DE MOT DE PASSE (par l'utilisateur connecté)
 * =============================================================================
 */
export class ChangePasswordDto {
  
  /**
   * Mot de passe actuel pour vérification
   */
  @IsNotEmpty({ message: 'Le mot de passe actuel est obligatoire' })
  @IsString({ message: 'Le mot de passe actuel doit être une chaîne' })
  @MinLength(8, { message: 'Le mot de passe actuel doit contenir au moins 8 caractères' })
  currentPassword!: string;

  /**
   * Nouveau mot de passe
   */
  @IsNotEmpty({ message: 'Le nouveau mot de passe est obligatoire' })
  @IsString({ message: 'Le nouveau mot de passe doit être une chaîne' })
  @MinLength(8, { message: 'Le nouveau mot de passe doit contenir au moins 8 caractères' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    { message: 'Le nouveau mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre' }
  )
  newPassword!: string;
}

/**
 * =============================================================================
 * DTO DE RÉINITIALISATION DE MOT DE PASSE PAR LE SUPER ADMIN
 * =============================================================================
 */
export class ResetPasswordByAdminDto {
  
  /**
   * Nouveau mot de passe défini par le super admin
   */
  @IsNotEmpty({ message: 'Le nouveau mot de passe est obligatoire' })
  @IsString({ message: 'Le nouveau mot de passe doit être une chaîne' })
  @MinLength(8, { message: 'Le nouveau mot de passe doit contenir au moins 8 caractères' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    { message: 'Le nouveau mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre' }
  )
  newPassword!: string;
}
