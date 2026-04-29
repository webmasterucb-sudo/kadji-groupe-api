/**
 * =============================================================================
 * SERVICE D'AUTHENTIFICATION ADMIN - MADIBA RUN
 * =============================================================================
 * 
 * Ce service gère l'authentification et l'autorisation des administrateurs
 * de la plateforme Madiba Run, incluant:
 * 
 * - Connexion avec génération de token JWT
 * - Inscription de nouveaux administrateurs
 * - Réinitialisation de mot de passe par super admin
 * - Validation des tokens et sessions
 * - Protection contre les attaques par force brute
 * 
 * Sécurité:
 * - Mots de passe hashés avec bcrypt (10 rounds)
 * - Tokens JWT avec expiration configurable
 * - Verrouillage après 5 tentatives échouées
 * 
 * @author API UCB Connect
 * @version 1.0.0
 */

import { 
  Injectable, 
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  Logger
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { AdminService } from './admin.service';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { 
  ChangePasswordDto, 
  ResetPasswordByAdminDto 
} from '../dto/update-admin.dto';
import { 
  Admin, 
  AdminDocument, 
  AdminStatus, 
  AdminRole 
} from '../entities/admin.entity';

// -----------------------------------------------------------------------------
// INTERFACES
// -----------------------------------------------------------------------------

/**
 * Payload encodé dans le token JWT
 */
export interface JwtPayload {
  sub: string;          // ID de l'administrateur
  email: string;        // Email
  role: AdminRole;      // Rôle pour les autorisations
  iat?: number;         // Issued at
  exp?: number;         // Expiration
}

/**
 * Réponse retournée après une connexion réussie
 */
export interface LoginResponse {
  accessToken: string;
  expiresIn: string;
  admin: {
    id: string;
    email: string;
    nom: string;
    prenom: string;
    role: AdminRole;
    status: AdminStatus;
  };
}

// -----------------------------------------------------------------------------
// CONSTANTES DE SÉCURITÉ
// -----------------------------------------------------------------------------

const BCRYPT_SALT_ROUNDS = 10;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 30;

// -----------------------------------------------------------------------------
// SERVICE
// -----------------------------------------------------------------------------

@Injectable()
export class AdminAuthService {
  
  private readonly logger = new Logger(AdminAuthService.name);

  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  // -------------------------------------------------------------------------
  // AUTHENTIFICATION
  // -------------------------------------------------------------------------

  /**
   * Authentifie un administrateur et retourne un token JWT
   * 
   * @param loginDto - Credentials de connexion
   * @returns Token JWT et informations de l'admin
   * @throws UnauthorizedException si credentials invalides
   * @throws ForbiddenException si compte non actif ou verrouillé
   */
  async login(loginDto: AdminLoginDto): Promise<LoginResponse> {
    this.logger.log(`Tentative de connexion: ${loginDto.email}`);

    // 1. Récupérer l'administrateur par email
    const admin = await this.adminService.findByEmail(loginDto.email);
    
    if (!admin) {
      this.logger.warn(`Tentative de connexion avec email inexistant: ${loginDto.email}`);
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // 2. Vérifier si le compte est verrouillé
    if (admin.verrouillageJusqua && admin.verrouillageJusqua > new Date()) {
      const minutesRestantes = Math.ceil(
        (admin.verrouillageJusqua.getTime() - Date.now()) / 60000
      );
      throw new ForbiddenException(
        `Compte verrouillé. Réessayez dans ${minutesRestantes} minutes`
      );
    }

    // 3. Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(loginDto.password, admin.password);
    
    if (!isPasswordValid) {
      await this.handleFailedLogin(admin);
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // 4. Vérifier le statut du compte
    if (admin.status !== AdminStatus.ACTIF) {
      throw new ForbiddenException(
        this.getStatusMessage(admin.status) 
      );
    }

    // 5. Enregistrer la connexion réussie
    await this.adminService.recordLogin((admin as any)._id.toString());

    // 6. Générer et retourner le token JWT
    const token = this.generateToken(admin);
    
    this.logger.log(`Connexion réussie: ${admin.email}`);

    return {
      accessToken: token,
      expiresIn: this.configService.get<string>('JWT_EXPIRATION') || '24h',
      admin: {
        id: (admin as any)._id.toString(),
        email: admin.email,
        nom: admin.nom,
        prenom: admin.prenom,
        role: admin.role,
        status: admin.status
      }
    };
  }

  /**
   * Gère une tentative de connexion échouée
   * Verrouille le compte après MAX_LOGIN_ATTEMPTS tentatives
   * 
   * @param admin - L'administrateur concerné
   */
  private async handleFailedLogin(admin: AdminDocument): Promise<void> {
    const newAttempts = (admin.tentativesConnexion || 0) + 1;
    
    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      // Verrouiller le compte
      const lockUntil = new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000);
      await this.adminService.recordFailedLogin((admin as any)._id.toString(), lockUntil);
      
      this.logger.warn(
        `Compte verrouillé après ${MAX_LOGIN_ATTEMPTS} tentatives: ${admin.email}`
      );
    } else {
      await this.adminService.recordFailedLogin((admin as any)._id.toString());
      
      this.logger.warn(
        `Tentative de connexion échouée (${newAttempts}/${MAX_LOGIN_ATTEMPTS}): ${admin.email}`
      );
    }
  }

  /**
   * Retourne un message approprié selon le statut du compte
   */
  private getStatusMessage(status: AdminStatus): string {
    const messages: Record<AdminStatus, string> = {
      [AdminStatus.ACTIF]: '',
      [AdminStatus.INACTIF]: 'Votre compte est désactivé. Contactez un administrateur.',
      [AdminStatus.SUSPENDU]: 'Votre compte est suspendu pour violation des règles.',
      [AdminStatus.EN_ATTENTE]: 'Votre compte est en attente de validation par un administrateur.'
    };
    return messages[status];
  }

  // -------------------------------------------------------------------------
  // INSCRIPTION
  // -------------------------------------------------------------------------

  /**
   * Inscrit un nouvel administrateur
   * Le compte est créé avec le statut EN_ATTENTE
   * 
   * @param createAdminDto - Données d'inscription
   * @param creePar - ID de l'admin créateur (si applicable)
   * @returns L'administrateur créé
   */
  async register(
    createAdminDto: CreateAdminDto, 
    creePar?: string
  ): Promise<AdminDocument> {
    this.logger.log(`Inscription d'un nouvel administrateur: ${createAdminDto.email}`);

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(
      createAdminDto.password, 
      BCRYPT_SALT_ROUNDS
    );

    // Créer l'admin avec le mot de passe hashé
    const admin = await this.adminService.create(
      { ...createAdminDto, password: hashedPassword },
      creePar
    );

    this.logger.log(`Administrateur créé avec succès: ${admin.email}`);

    return admin;
  }

  /**
   * Crée directement un administrateur ACTIF (réservé aux SUPER_ADMIN)
   * 
   * @param createAdminDto - Données d'inscription
   * @param creePar - ID du SUPER_ADMIN créateur
   * @returns L'administrateur créé et activé
   */
  async createActiveAdmin(
    createAdminDto: CreateAdminDto,
    creePar: string
  ): Promise<AdminDocument> {
    this.logger.log(`Création d'admin actif par SUPER_ADMIN: ${createAdminDto.email}`);

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(
      createAdminDto.password, 
      BCRYPT_SALT_ROUNDS
    );

    // Créer et activer directement
    const admin = await this.adminService.create(
      { ...createAdminDto, password: hashedPassword },
      creePar
    );

    // Activer immédiatement le compte
    await this.adminService.updateStatus((admin as any)._id.toString(), AdminStatus.ACTIF);

    return admin;
  }

  // -------------------------------------------------------------------------
  // GESTION DES TOKENS JWT
  // -------------------------------------------------------------------------

  /**
   * Génère un token JWT pour un administrateur
   * 
   * @param admin - L'administrateur
   * @returns Token JWT signé
   */
  private generateToken(admin: AdminDocument): string {
    const payload: JwtPayload = {
      sub: (admin as any)._id.toString(),
      email: admin.email,
      role: admin.role
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Valide un token JWT et retourne le payload
   * 
   * @param token - Token JWT à valider
   * @returns Payload décodé
   * @throws UnauthorizedException si token invalide
   */
  async validateToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch (error) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }

  /**
   * Récupère l'administrateur depuis le payload JWT
   * 
   * @param payload - Payload JWT décodé
   * @returns L'administrateur
   */
  async getAdminFromPayload(payload: JwtPayload): Promise<AdminDocument> {
    return this.adminService.findById(payload.sub);
  }

  // -------------------------------------------------------------------------
  // CHANGEMENT DE MOT DE PASSE
  // -------------------------------------------------------------------------

  /**
   * Change le mot de passe d'un administrateur connecté
   * 
   * @param adminId - ID de l'administrateur
   * @param changePasswordDto - Ancien et nouveau mot de passe
   * @throws BadRequestException si l'ancien mot de passe est incorrect
   */
  async changePassword(
    adminId: string, 
    changePasswordDto: ChangePasswordDto
  ): Promise<void> {
    this.logger.log(`Changement de mot de passe pour: ${adminId}`);

    // Récupérer l'admin avec son mot de passe
    const admin = await this.adminService.findByEmail(
      (await this.adminService.findById(adminId)).email
    );

    if (!admin) {
      throw new BadRequestException('Administrateur non trouvé');
    }

    // Vérifier l'ancien mot de passe
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      admin.password
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Le mot de passe actuel est incorrect');
    }

    // Hasher et sauvegarder le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(
      changePasswordDto.newPassword, 
      BCRYPT_SALT_ROUNDS
    );

    await this.adminService.updatePassword(adminId, hashedPassword);
    
    this.logger.log(`Mot de passe changé avec succès pour: ${adminId}`);
  }

  // -------------------------------------------------------------------------
  // RÉINITIALISATION DE MOT DE PASSE PAR SUPER ADMIN
  // -------------------------------------------------------------------------

  /**
   * Réinitialise le mot de passe d'un administrateur (par un super admin)
   * Cette méthode permet au super admin de définir directement un nouveau 
   * mot de passe sans passer par un processus d'email.
   * 
   * @param adminId - ID de l'administrateur concerné
   * @param resetPasswordDto - Nouveau mot de passe
   * @throws BadRequestException si admin non trouvé
   */
  async resetPasswordByAdmin(
    adminId: string, 
    resetPasswordDto: ResetPasswordByAdminDto
  ): Promise<void> {
    this.logger.log(`Réinitialisation du mot de passe par super admin pour: ${adminId}`);

    // Vérifier que l'admin existe
    const admin = await this.adminService.findById(adminId);
    
    if (!admin) {
      throw new BadRequestException('Administrateur non trouvé');
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(
      resetPasswordDto.newPassword, 
      BCRYPT_SALT_ROUNDS
    );

    // Mettre à jour le mot de passe
    await this.adminService.updatePassword(adminId, hashedPassword);

    // Réactiver le compte si suspendu
    if (admin.status === AdminStatus.SUSPENDU) {
      await this.adminService.updateStatus(adminId, AdminStatus.ACTIF);
    }

    // Réinitialiser les tentatives de connexion si le compte était verrouillé
    await this.adminService.unlockAccount(adminId);

    this.logger.log(`Mot de passe réinitialisé par super admin pour: ${admin.email}`);
  }

  /**
   * Déverrouille un compte administrateur (par un super admin)
   * 
   * @param adminId - ID de l'administrateur à déverrouiller
   */
  async unlockAccount(adminId: string): Promise<void> {
    this.logger.log(`Déverrouillage du compte: ${adminId}`);
    
    await this.adminService.unlockAccount(adminId);
    
    this.logger.log(`Compte déverrouillé avec succès: ${adminId}`);
  }
}
