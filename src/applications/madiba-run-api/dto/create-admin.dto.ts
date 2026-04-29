/**
 * =============================================================================
 * DTO DE CRÉATION ADMIN - MADIBA RUN
 * =============================================================================
 * 
 * Ce DTO définit la structure et les validations pour l'inscription
 * de nouveaux administrateurs sur la plateforme Madiba Run.
 * 
 * Les nouveaux comptes sont créés avec le statut "EN_ATTENTE" et doivent
 * être validés par un SUPER_ADMIN avant de pouvoir se connecter.
 * 
 * @author API UCB Connect
 * @version 1.0.0
 */

import { 
  IsEmail, 
  IsNotEmpty, 
  MinLength,
  MaxLength,
  IsString,
  IsEnum,
  IsOptional,
  Matches
} from 'class-validator';
import { AdminRole } from '../entities/admin.entity';

export class CreateAdminDto {
  
  // -------------------------------------------------------------------------
  // INFORMATIONS PERSONNELLES
  // -------------------------------------------------------------------------

  /**
   * Nom de famille de l'administrateur
   * @example Kamga
   */
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @MaxLength(100, { message: 'Le nom ne doit pas dépasser 100 caractères' })
  nom!: string;

  /**
   * Prénom de l'administrateur
   * @example Jean-Pierre
   */
  @IsNotEmpty({ message: 'Le prénom est obligatoire' })
  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  @MaxLength(100, { message: 'Le prénom ne doit pas dépasser 100 caractères' })
  prenom!: string;

  /**
   * Numéro de téléphone (format recommandé: +237XXXXXXXXX)
   * @example +237 690 123 456
   */
  @IsNotEmpty({ message: 'Le numéro de téléphone est obligatoire' })
  @IsString({ message: 'Le téléphone doit être une chaîne de caractères' })
  @MaxLength(20, { message: 'Le téléphone ne doit pas dépasser 20 caractères' })
  telephone!: string;

  // -------------------------------------------------------------------------
  // INFORMATIONS DE CONNEXION
  // -------------------------------------------------------------------------

  /**
   * Adresse email unique servant d'identifiant de connexion
   * @example jean.kamga@madibarun.cm
   */
  @IsNotEmpty({ message: 'L\'email est obligatoire' })
  @IsEmail({}, { message: 'Format d\'email invalide' })
  @MaxLength(255, { message: 'L\'email ne doit pas dépasser 255 caractères' })
  email!: string;

  /**
   * Mot de passe avec exigences de sécurité:
   * - Minimum 8 caractères
   * - Au moins une majuscule
   * - Au moins une minuscule
   * - Au moins un chiffre
   * @example MonMotDePasse123
   */
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    { message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre' }
  )
  password!: string;

  // -------------------------------------------------------------------------
  // RÔLE (optionnel, assigné par un SUPER_ADMIN)
  // -------------------------------------------------------------------------

  /**
   * Rôle de l'administrateur (par défaut: MODERATEUR)
   */
  @IsOptional()
  @IsEnum(AdminRole, { 
    message: `Le rôle doit être l'une des valeurs suivantes: ${Object.values(AdminRole).join(', ')}` 
  })
  role?: AdminRole;
}
