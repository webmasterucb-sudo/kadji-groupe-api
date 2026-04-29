/**
 * =============================================================================
 * SERVICE ADMIN - MADIBA RUN
 * =============================================================================
 * 
 * Ce service gère les opérations CRUD (Create, Read, Update, Delete) pour
 * les administrateurs de la plateforme Madiba Run.
 * 
 * Responsabilités:
 * - Gestion des comptes administrateurs
 * - Recherche et filtrage des admins
 * - Mise à jour des informations et statuts
 * - Statistiques d'administration
 * 
 * @author API UCB Connect
 * @version 1.0.0
 */

import { 
  Injectable, 
  NotFoundException,
  ConflictException,
  Logger
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Admin, AdminDocument, AdminStatus, AdminRole } from '../entities/admin.entity';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';

// -----------------------------------------------------------------------------
// INTERFACES
// -----------------------------------------------------------------------------

/**
 * Options de filtrage pour la liste des administrateurs
 */
export interface AdminFilterOptions {
  role?: AdminRole;
  status?: AdminStatus;
  search?: string;        // Recherche par nom, prénom ou email
  page?: number;
  limit?: number;
}

/**
 * Résultat paginé pour la liste des administrateurs
 */
export interface PaginatedAdminResult {
  data: AdminDocument[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// -----------------------------------------------------------------------------
// SERVICE
// -----------------------------------------------------------------------------

@Injectable()
export class AdminService {
  
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectModel(Admin.name) 
    private readonly adminModel: Model<AdminDocument>
  ) {}

  // -------------------------------------------------------------------------
  // OPÉRATIONS DE CRÉATION
  // -------------------------------------------------------------------------

  /**
   * Crée un nouveau compte administrateur
   * 
   * @param createAdminDto - Données de création
   * @param creePar - ID de l'admin créateur (optionnel)
   * @returns Le nouvel administrateur créé
   * @throws ConflictException si l'email existe déjà
   */
  async create(createAdminDto: CreateAdminDto, creePar?: string): Promise<AdminDocument> {
    this.logger.log(`Création d'un nouvel administrateur: ${createAdminDto.email}`);

    // Vérifier si l'email existe déjà
    const existingAdmin = await this.findByEmail(createAdminDto.email);
    if (existingAdmin) {
      throw new ConflictException('Un administrateur avec cet email existe déjà');
    }

    // Créer l'administrateur avec le statut EN_ATTENTE par défaut
    const newAdmin = new this.adminModel({
      ...createAdminDto,
      creePar,
      status: AdminStatus.EN_ATTENTE, // Nécessite validation par SUPER_ADMIN
    });

    const savedAdmin = await newAdmin.save();
    this.logger.log(`Administrateur créé avec succès: ${savedAdmin._id}`);
    
    return savedAdmin;
  }

  // -------------------------------------------------------------------------
  // OPÉRATIONS DE LECTURE
  // -------------------------------------------------------------------------

  /**
   * Récupère un administrateur par son ID
   * 
   * @param id - ID MongoDB de l'administrateur
   * @returns L'administrateur trouvé
   * @throws NotFoundException si non trouvé
   */
  async findById(id: string): Promise<AdminDocument> {
    const admin = await this.adminModel.findById(id).select('-password').exec();
    
    if (!admin) {
      throw new NotFoundException(`Administrateur avec l'ID ${id} non trouvé`);
    }
    
    return admin;
  }

  /**
   * Récupère un administrateur par son email (incluant le mot de passe)
   * Utilisé uniquement pour l'authentification
   * 
   * @param email - Email de l'administrateur
   * @returns L'administrateur ou null
   */
  async findByEmail(email: string): Promise<AdminDocument | null> {
    return this.adminModel.findOne({ 
      email: email.toLowerCase() 
    }).exec();
  }

  /**
   * Récupère un administrateur par son email (sans le mot de passe)
   * 
   * @param email - Email de l'administrateur
   * @returns L'administrateur sans le mot de passe
   */
  async findByEmailPublic(email: string): Promise<AdminDocument | null> {
    return this.adminModel.findOne({ 
      email: email.toLowerCase() 
    }).select('-password').exec();
  }

  /**
   * Récupère tous les administrateurs avec filtrage et pagination
   * 
   * @param options - Options de filtrage et pagination
   * @returns Liste paginée des administrateurs
   */
  async findAll(options: AdminFilterOptions = {}): Promise<PaginatedAdminResult> {
    const { 
      role, 
      status, 
      search, 
      page = 1, 
      limit = 20 
    } = options;

    // Construction du filtre de recherche
    const filter: FilterQuery<AdminDocument> = {};

    if (role) {
      filter.role = role;
    }

    if (status) {
      filter.status = status;
    }

    // Recherche textuelle sur nom, prénom ou email
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { nom: searchRegex },
        { prenom: searchRegex },
        { email: searchRegex }
      ];
    }

    // Calcul de la pagination
    const skip = (page - 1) * limit;
    const total = await this.adminModel.countDocuments(filter).exec();
    const totalPages = Math.ceil(total / limit);

    // Exécution de la requête
    const data = await this.adminModel
      .find(filter)
      .select('-password')           // Exclure le mot de passe
      .sort({ createdAt: -1 })       // Plus récents en premier
      .skip(skip)
      .limit(limit)
      .exec();

    this.logger.log(`Récupération de ${data.length} administrateurs (page ${page}/${totalPages})`);

    return {
      data,
      total,
      page,
      limit,
      totalPages
    };
  }

  // -------------------------------------------------------------------------
  // OPÉRATIONS DE MISE À JOUR
  // -------------------------------------------------------------------------

  /**
   * Met à jour les informations d'un administrateur
   * 
   * @param id - ID de l'administrateur
   * @param updateAdminDto - Données à mettre à jour
   * @returns L'administrateur mis à jour
   * @throws NotFoundException si non trouvé
   */
  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<AdminDocument> {
    this.logger.log(`Mise à jour de l'administrateur: ${id}`);

    // Vérifier si l'admin existe
    const existingAdmin = await this.adminModel.findById(id).exec();
    if (!existingAdmin) {
      throw new NotFoundException(`Administrateur avec l'ID ${id} non trouvé`);
    }

    // Effectuer la mise à jour
    const updatedAdmin = await this.adminModel
      .findByIdAndUpdate(id, updateAdminDto, { new: true })
      .select('-password')
      .exec();

    this.logger.log(`Administrateur ${id} mis à jour avec succès`);
    
    return updatedAdmin!;
  }

  /**
   * Met à jour le mot de passe hashé d'un administrateur
   * 
   * @param id - ID de l'administrateur
   * @param hashedPassword - Nouveau mot de passe hashé
   */
  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.adminModel.findByIdAndUpdate(id, { 
      password: hashedPassword 
    }).exec();
    this.logger.log(`Mot de passe mis à jour pour l'administrateur: ${id}`);
  }

  /**
   * Met à jour le statut d'un administrateur
   * 
   * @param id - ID de l'administrateur
   * @param status - Nouveau statut
   * @returns L'administrateur mis à jour
   */
  async updateStatus(id: string, status: AdminStatus): Promise<AdminDocument> {
    this.logger.log(`Changement de statut de l'administrateur ${id} vers ${status}`);

    const updatedAdmin = await this.adminModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .select('-password')
      .exec();

    if (!updatedAdmin) {
      throw new NotFoundException(`Administrateur avec l'ID ${id} non trouvé`);
    }

    return updatedAdmin;
  }

  /**
   * Enregistre la dernière connexion d'un administrateur
   * 
   * @param id - ID de l'administrateur
   */
  async recordLogin(id: string): Promise<void> {
    await this.adminModel.findByIdAndUpdate(id, {
      derniereConnexion: new Date(),
      tentativesConnexion: 0,         // Réinitialiser les tentatives
      verrouillageJusqua: null        // Déverrouiller si nécessaire
    }).exec();
  }

  /**
   * Incrémente le compteur de tentatives de connexion échouées
   * 
   * @param id - ID de l'administrateur
   * @param lockUntil - Date de verrouillage (optionnel, après 5 tentatives)
   */
  async recordFailedLogin(id: string, lockUntil?: Date): Promise<void> {
    const update: any = {
      $inc: { tentativesConnexion: 1 }
    };

    if (lockUntil) {
      update.verrouillageJusqua = lockUntil;
    }

    await this.adminModel.findByIdAndUpdate(id, update).exec();
  }

  /**
   * Déverrouille un compte administrateur et réinitialise les tentatives
   * 
   * @param id - ID de l'administrateur à déverrouiller
   */
  async unlockAccount(id: string): Promise<void> {
    await this.adminModel.findByIdAndUpdate(id, {
      tentativesConnexion: 0,
      verrouillageJusqua: null
    }).exec();
    this.logger.log(`Compte déverrouillé pour l'administrateur: ${id}`);
  }

  // -------------------------------------------------------------------------
  // GESTION DU TOKEN DE RÉINITIALISATION
  // -------------------------------------------------------------------------

  /**
   * Stocke le token de réinitialisation de mot de passe
   * 
   * @param id - ID de l'administrateur
   * @param token - Token de réinitialisation
   * @param expiresAt - Date d'expiration du token
   */
  async setResetPasswordToken(id: string, token: string, expiresAt: Date): Promise<void> {
    await this.adminModel.findByIdAndUpdate(id, {
      resetPasswordToken: token,
      resetPasswordExpires: expiresAt
    }).exec();
    this.logger.log(`Token de réinitialisation défini pour l'administrateur: ${id}`);
  }

  /**
   * Trouve un administrateur par son token de réinitialisation
   * 
   * @param token - Token de réinitialisation
   * @returns L'administrateur ou null
   */
  async findByResetToken(token: string): Promise<AdminDocument | null> {
    return this.adminModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }  // Token non expiré
    }).exec();
  }

  /**
   * Efface le token de réinitialisation après utilisation
   * 
   * @param id - ID de l'administrateur
   */
  async clearResetToken(id: string): Promise<void> {
    await this.adminModel.findByIdAndUpdate(id, {
      resetPasswordToken: null,
      resetPasswordExpires: null
    }).exec();
  }

  // -------------------------------------------------------------------------
  // OPÉRATIONS DE SUPPRESSION
  // -------------------------------------------------------------------------

  /**
   * Supprime un administrateur (soft delete recommandé en production)
   * 
   * @param id - ID de l'administrateur à supprimer
   * @throws NotFoundException si non trouvé
   */
  async delete(id: string): Promise<void> {
    this.logger.warn(`Suppression de l'administrateur: ${id}`);

    const result = await this.adminModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException(`Administrateur avec l'ID ${id} non trouvé`);
    }

    this.logger.log(`Administrateur ${id} supprimé avec succès`);
  }

  // -------------------------------------------------------------------------
  // STATISTIQUES
  // -------------------------------------------------------------------------

  /**
   * Récupère les statistiques des administrateurs
   * 
   * @returns Statistiques globales
   */
  async getStatistics(): Promise<{
    total: number;
    parRole: Record<AdminRole, number>;
    parStatus: Record<AdminStatus, number>;
  }> {
    const total = await this.adminModel.countDocuments().exec();

    // Agrégation par rôle
    const roleStats = await this.adminModel.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]).exec();

    // Agrégation par statut
    const statusStats = await this.adminModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]).exec();

    // Formater les résultats
    const parRole = Object.values(AdminRole).reduce((acc, role) => {
      const stat = roleStats.find(s => s._id === role);
      acc[role] = stat ? stat.count : 0;
      return acc;
    }, {} as Record<AdminRole, number>);

    const parStatus = Object.values(AdminStatus).reduce((acc, status) => {
      const stat = statusStats.find(s => s._id === status);
      acc[status] = stat ? stat.count : 0;
      return acc;
    }, {} as Record<AdminStatus, number>);

    return { total, parRole, parStatus };
  }
}
