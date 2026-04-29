/**
 * =============================================================================
 * ENTITÉ ADMIN - MADIBA RUN
 * =============================================================================
 * 
 * Cette entité définit le schéma MongoDB pour les administrateurs de la
 * plateforme Madiba Run. Elle gère les différents niveaux d'accès et
 * permissions des utilisateurs administratifs.
 * 
 * Rôles disponibles:
 * - SUPER_ADMIN: Accès complet à toutes les fonctionnalités
 * - ADMIN: Gestion des participants et des données
 * - MODERATEUR: Consultation et validation des inscriptions
 * 
 * @author API UCB Connect
 * @version 1.0.0
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// -----------------------------------------------------------------------------
// TYPES ET ÉNUMÉRATIONS
// -----------------------------------------------------------------------------

/**
 * Document Mongoose pour l'entité Admin
 */
export type AdminDocument = Admin & Document;

/**
 * Rôles des administrateurs avec leurs niveaux de permission
 */
export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',  // Accès total, gestion des autres admins
  ADMIN = 'ADMIN',              // Gestion complète des participants
  MODERATEUR = 'MODERATEUR',    // Consultation et validation uniquement
}

/**
 * Statuts possibles d'un compte administrateur
 */
export enum AdminStatus {
  ACTIF = 'ACTIF',              // Compte actif et fonctionnel
  INACTIF = 'INACTIF',          // Compte désactivé temporairement
  SUSPENDU = 'SUSPENDU',        // Compte suspendu (violation des règles)
  EN_ATTENTE = 'EN_ATTENTE',    // En attente de validation par un super admin
}

// -----------------------------------------------------------------------------
// SCHÉMA MONGOOSE
// -----------------------------------------------------------------------------

@Schema({ 
  timestamps: true,           // Ajoute automatiquement createdAt et updatedAt
  collection: 'madiba_admin_users' // Nom explicite de la collection MongoDB
})
export class Admin {
  
  // -------------------------------------------------------------------------
  // INFORMATIONS PERSONNELLES
  // -------------------------------------------------------------------------

  @Prop({ 
    required: true, 
    maxlength: 100,
    trim: true,
    comment: 'Nom de famille de l\'administrateur'
  })
  nom!: string;

  @Prop({ 
    required: true, 
    maxlength: 100,
    trim: true,
    comment: 'Prénom de l\'administrateur'
  })
  prenom!: string;

  @Prop({ 
    required: true, 
    maxlength: 20,
    trim: true,
    comment: 'Numéro de téléphone (format international recommandé)'
  })
  telephone!: string;

  // -------------------------------------------------------------------------
  // INFORMATIONS DE CONNEXION
  // -------------------------------------------------------------------------

  @Prop({ 
    required: true, 
    unique: true, 
    maxlength: 255,
    lowercase: true,          // Normalise l'email en minuscules
    trim: true,
    comment: 'Adresse email unique servant d\'identifiant de connexion'
  })
  email!: string;

  @Prop({ 
    required: true,
    comment: 'Mot de passe hashé avec bcrypt (salt rounds: 10)'
  })
  password!: string;

  // -------------------------------------------------------------------------
  // RÔLE ET PERMISSIONS
  // -------------------------------------------------------------------------

  @Prop({ 
    type: String,
    enum: Object.values(AdminRole),
    default: AdminRole.MODERATEUR,
    comment: 'Rôle déterminant les permissions de l\'administrateur'
  })
  role!: AdminRole;

  @Prop({ 
    type: String,
    enum: Object.values(AdminStatus),
    default: AdminStatus.EN_ATTENTE,
    comment: 'Statut actuel du compte administrateur'
  })
  status!: AdminStatus;

  // -------------------------------------------------------------------------
  // SÉCURITÉ ET AUDIT
  // -------------------------------------------------------------------------

  @Prop({ 
    type: Date,
    default: null,
    comment: 'Date et heure de la dernière connexion'
  })
  derniereConnexion?: Date;

  @Prop({ 
    type: String,
    default: null,
    comment: 'Token de réinitialisation de mot de passe (temporaire)'
  })
  resetPasswordToken?: string;

  @Prop({ 
    type: Date,
    default: null,
    comment: 'Date d\'expiration du token de réinitialisation'
  })
  resetPasswordExpires?: Date;

  @Prop({ 
    type: String,
    default: null,
    comment: 'ID de l\'administrateur ayant créé ce compte'
  })
  creePar?: string;

  @Prop({ 
    type: Number,
    default: 0,
    comment: 'Nombre de tentatives de connexion échouées consécutives'
  })
  tentativesConnexion!: number;

  @Prop({ 
    type: Date,
    default: null,
    comment: 'Date de verrouillage après trop de tentatives échouées'
  })
  verrouillageJusqua?: Date;

  // -------------------------------------------------------------------------
  // MÉTADONNÉES (générées automatiquement par timestamps: true)
  // -------------------------------------------------------------------------

  createdAt?: Date;
  updatedAt?: Date;
}

// -----------------------------------------------------------------------------
// FACTORY DU SCHÉMA
// -----------------------------------------------------------------------------

export const AdminSchema = SchemaFactory.createForClass(Admin);

// -----------------------------------------------------------------------------
// INDEX POUR OPTIMISATION DES REQUÊTES
// -----------------------------------------------------------------------------

// Index sur l'email pour les recherches de connexion rapides
AdminSchema.index({ email: 1 });

// Index composite pour les requêtes de liste par statut et rôle
AdminSchema.index({ status: 1, role: 1 });

// Index sur le token de réinitialisation pour la validation
AdminSchema.index({ resetPasswordToken: 1 }, { sparse: true });
