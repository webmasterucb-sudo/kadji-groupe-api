/**
 * =============================================================================
 * CONTRÔLEUR D'AUTHENTIFICATION ADMIN - MADIBA RUN
 * =============================================================================
 * 
 * Ce contrôleur expose les routes REST pour l'authentification et la gestion
 * des administrateurs de la plateforme Madiba Run.
 * 
 * Routes publiques:
 * - POST /admin/auth/login          - Connexion
 * - POST /admin/auth/register       - Inscription (compte en attente)
 * 
 * Routes protégées (JWT requis):
 * - GET  /admin/auth/profile        - Profil de l'admin connecté
 * - PUT  /admin/auth/profile        - Mise à jour du profil
 * - POST /admin/auth/change-password - Changement de mot de passe
 * 
 * Routes SUPER_ADMIN:
 * - GET    /admin/auth/list              - Liste des administrateurs
 * - GET    /admin/auth/stats             - Statistiques
 * - POST   /admin/auth/create            - Créer un admin actif
 * - PUT    /admin/auth/:id               - Modifier un admin
 * - PUT    /admin/auth/:id/status        - Changer le statut
 * - PUT    /admin/auth/:id/reset-password - Réinitialiser le mot de passe
 * - PUT    /admin/auth/:id/unlock        - Déverrouiller un compte
 * - DELETE /admin/auth/:id               - Supprimer un admin
 * 
 * @author API UCB Connect
 * @version 1.0.0
 */

import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Logger,
  ForbiddenException
} from '@nestjs/common';

import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { AdminAuthService, LoginResponse } from './services/admin-auth.service';
import { AdminService, AdminFilterOptions, PaginatedAdminResult } from './services/admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { 
  UpdateAdminDto, 
  ChangePasswordDto,
  ResetPasswordByAdminDto 
} from './dto/update-admin.dto';
import { AdminRole, AdminStatus, AdminDocument } from './entities/admin.entity';

// -----------------------------------------------------------------------------
// TYPE POUR LA REQUÊTE AUTHENTIFIÉE
// -----------------------------------------------------------------------------

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: AdminRole;
  };
}

// -----------------------------------------------------------------------------
// CONTRÔLEUR
// -----------------------------------------------------------------------------

@Controller('madiba-run/admin/auth')
export class AdminAuthController {
  
  private readonly logger = new Logger(AdminAuthController.name);

  constructor(
    private readonly adminAuthService: AdminAuthService,
    private readonly adminService: AdminService
  ) {}

  // =========================================================================
  // ROUTES PUBLIQUES (SANS AUTHENTIFICATION)
  // =========================================================================

  /**
   * Connexion d'un administrateur
   * Retourne un token JWT valide 24h
   * 
   * @route POST /madiba-run/admin/auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AdminLoginDto): Promise<LoginResponse> {
    this.logger.log(`POST /login - ${loginDto.email}`);
    return this.adminAuthService.login(loginDto);
  }

  /**
   * Inscription d'un nouvel administrateur
   * Le compte est créé avec le statut EN_ATTENTE et nécessite validation
   * 
   * @route POST /madiba-run/admin/auth/register
   */
  @Post('register')
  async register(@Body() createAdminDto: CreateAdminDto): Promise<{ 
    message: string; 
    admin: any;
  }> {
    this.logger.log(`POST /register - ${createAdminDto.email}`);
    
    const admin = await this.adminAuthService.register(createAdminDto);
    
    return {
      message: 'Inscription réussie. Votre compte est en attente de validation.',
      admin: {
        id: (admin as any)._id,
        email: admin.email,
        nom: admin.nom,
        prenom: admin.prenom,
        status: admin.status
      }
    };
  }

  // =========================================================================
  // ROUTES PROTÉGÉES (JWT REQUIS)
  // =========================================================================

  /**
   * Récupère le profil de l'administrateur connecté
   * 
   * @route GET /madiba-run/admin/auth/profile
   * @requires JWT Token
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: AuthenticatedRequest): Promise<AdminDocument> {
    this.logger.log(`GET /profile - ${req.user.email}`);
    return this.adminService.findById(req.user.userId);
  }

  /**
   * Met à jour le profil de l'administrateur connecté
   * Note: Un admin ne peut pas modifier son propre rôle ou statut
   * 
   * @route PUT /madiba-run/admin/auth/profile
   * @requires JWT Token
   */
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateAdminDto: UpdateAdminDto
  ): Promise<AdminDocument> {
    this.logger.log(`PUT /profile - ${req.user.email}`);
    
    // Sécurité: Un admin ne peut pas changer son propre rôle ou statut
    const { role, status, ...allowedUpdates } = updateAdminDto;
    
    return this.adminService.update(req.user.userId, allowedUpdates);
  }

  /**
   * Change le mot de passe de l'administrateur connecté
   * Requiert la validation de l'ancien mot de passe
   * 
   * @route POST /madiba-run/admin/auth/change-password
   * @requires JWT Token
   */
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<{ message: string }> {
    this.logger.log(`POST /change-password - ${req.user.email}`);
    
    await this.adminAuthService.changePassword(req.user.userId, changePasswordDto);
    
    return { message: 'Mot de passe changé avec succès' };
  }

  // =========================================================================
  // ROUTES SUPER_ADMIN (GESTION DES ADMINISTRATEURS)
  // =========================================================================

  /**
   * Liste tous les administrateurs avec filtrage et pagination
   * Accessible aux SUPER_ADMIN et ADMIN
   * 
   * @route GET /madiba-run/admin/auth/list
   * @requires JWT Token + Role ADMIN ou SUPER_ADMIN
   * @query role - Filtrer par rôle (optionnel)
   * @query status - Filtrer par statut (optionnel)
   * @query search - Recherche textuelle (optionnel)
   * @query page - Numéro de page (défaut: 1)
   * @query limit - Résultats par page (défaut: 20)
   */
  @Get('list')
  @UseGuards(JwtAuthGuard)
  async listAdmins(
    @Request() req: AuthenticatedRequest,
    @Query('role') role?: AdminRole,
    @Query('status') status?: AdminStatus,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ): Promise<PaginatedAdminResult> {
    this.logger.log(`GET /list - par ${req.user.email}`);
    
    // Vérification des permissions
    this.checkAdminAccess(req.user.role);
    
    const options: AdminFilterOptions = {
      role,
      status,
      search,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20
    };
    
    return this.adminService.findAll(options);
  }

  /**
   * Statistiques des administrateurs
   * Réservé aux SUPER_ADMIN
   * 
   * @route GET /madiba-run/admin/auth/stats
   * @requires JWT Token + Role SUPER_ADMIN
   */
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats(@Request() req: AuthenticatedRequest): Promise<any> {
    this.logger.log(`GET /stats - par ${req.user.email}`);
    
    // Réservé aux SUPER_ADMIN
    this.checkSuperAdminAccess(req.user.role);
    
    return this.adminService.getStatistics();
  }

  /**
   * Crée un administrateur avec activation immédiate
   * Réservé aux SUPER_ADMIN - le compte est directement ACTIF
   * 
   * @route POST /madiba-run/admin/auth/create
   * @requires JWT Token + Role SUPER_ADMIN
   */
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createAdmin(
    @Request() req: AuthenticatedRequest,
    @Body() createAdminDto: CreateAdminDto
  ): Promise<{ message: string; admin: any }> {
    this.logger.log(`POST /create - par ${req.user.email}`);
    
    // Réservé aux SUPER_ADMIN
    this.checkSuperAdminAccess(req.user.role);
    
    const admin = await this.adminAuthService.createActiveAdmin(
      createAdminDto, 
      req.user.userId
    );
    
    return {
      message: 'Administrateur créé et activé avec succès',
      admin: {
        id: (admin as any)._id,
        email: admin.email,
        nom: admin.nom,
        prenom: admin.prenom,
        role: admin.role,
        status: AdminStatus.ACTIF
      }
    };
  }

  /**
   * Met à jour un administrateur
   * Réservé aux SUPER_ADMIN
   * 
   * @route PUT /madiba-run/admin/auth/:id
   * @requires JWT Token + Role SUPER_ADMIN
   * @param id - ID MongoDB de l'administrateur
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateAdmin(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto
  ): Promise<AdminDocument> {
    this.logger.log(`PUT /${id} - par ${req.user.email}`);
    
    // Réservé aux SUPER_ADMIN
    this.checkSuperAdminAccess(req.user.role);
    
    return this.adminService.update(id, updateAdminDto);
  }

  /**
   * Change le statut d'un administrateur
   * Permet d'activer, désactiver ou suspendre un compte
   * 
   * @route PUT /madiba-run/admin/auth/:id/status
   * @requires JWT Token + Role SUPER_ADMIN
   * @param id - ID MongoDB de l'administrateur
   * @body status - Nouveau statut (ACTIF, INACTIF, SUSPENDU, EN_ATTENTE)
   */
  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body('status') status: AdminStatus
  ): Promise<{ message: string; admin: AdminDocument }> {
    this.logger.log(`PUT /${id}/status - ${status} par ${req.user.email}`);
    
    // Réservé aux SUPER_ADMIN
    this.checkSuperAdminAccess(req.user.role);
    
    // Sécurité: Un SUPER_ADMIN ne peut pas se désactiver lui-même
    if (id === req.user.userId && status !== AdminStatus.ACTIF) {
      throw new ForbiddenException('Vous ne pouvez pas désactiver votre propre compte');
    }
    
    const admin = await this.adminService.updateStatus(id, status);
    
    return {
      message: `Statut de l'administrateur mis à jour vers ${status}`,
      admin
    };
  }

  /**
   * Réinitialise le mot de passe d'un administrateur
   * Permet au super admin de définir directement un nouveau mot de passe
   * 
   * @route PUT /madiba-run/admin/auth/:id/reset-password
   * @requires JWT Token + Role SUPER_ADMIN
   * @param id - ID MongoDB de l'administrateur
   */
  @Put(':id/reset-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async resetPasswordByAdmin(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() resetPasswordDto: ResetPasswordByAdminDto
  ): Promise<{ message: string }> {
    this.logger.log(`PUT /${id}/reset-password - par ${req.user.email}`);
    
    // Réservé aux SUPER_ADMIN
    this.checkSuperAdminAccess(req.user.role);
    
    await this.adminAuthService.resetPasswordByAdmin(id, resetPasswordDto);
    
    return { message: 'Mot de passe réinitialisé avec succès' };
  }

  /**
   * Déverrouille un compte administrateur
   * Réinitialise les tentatives de connexion et supprime le verrouillage
   * 
   * @route PUT /madiba-run/admin/auth/:id/unlock
   * @requires JWT Token + Role SUPER_ADMIN
   * @param id - ID MongoDB de l'administrateur
   */
  @Put(':id/unlock')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async unlockAccount(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string
  ): Promise<{ message: string }> {
    this.logger.log(`PUT /${id}/unlock - par ${req.user.email}`);
    
    // Réservé aux SUPER_ADMIN
    this.checkSuperAdminAccess(req.user.role);
    
    await this.adminAuthService.unlockAccount(id);
    
    return { message: 'Compte déverrouillé avec succès' };
  }

  /**
   * Supprime définitivement un administrateur
   * Action irréversible - réservée aux SUPER_ADMIN
   * 
   * @route DELETE /madiba-run/admin/auth/:id
   * @requires JWT Token + Role SUPER_ADMIN
   * @param id - ID MongoDB de l'administrateur
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteAdmin(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string
  ): Promise<{ message: string }> {
    this.logger.log(`DELETE /${id} - par ${req.user.email}`);
    
    // Réservé aux SUPER_ADMIN
    this.checkSuperAdminAccess(req.user.role);
    
    // Sécurité: Un SUPER_ADMIN ne peut pas se supprimer lui-même
    if (id === req.user.userId) {
      throw new ForbiddenException('Vous ne pouvez pas supprimer votre propre compte');
    }
    
    await this.adminService.delete(id);
    
    return { message: 'Administrateur supprimé avec succès' };
  }

  // =========================================================================
  // MÉTHODES UTILITAIRES PRIVÉES
  // =========================================================================

  /**
   * Vérifie que l'utilisateur a un accès administrateur (SUPER_ADMIN ou ADMIN)
   * @throws ForbiddenException si permissions insuffisantes
   */
  private checkAdminAccess(role: AdminRole): void {
    if (role !== AdminRole.SUPER_ADMIN && role !== AdminRole.ADMIN) {
      throw new ForbiddenException('Accès non autorisé. Permissions insuffisantes.');
    }
  }

  /**
   * Vérifie que l'utilisateur est un SUPER_ADMIN
   * @throws ForbiddenException si l'utilisateur n'est pas SUPER_ADMIN
   */
  private checkSuperAdminAccess(role: AdminRole): void {
    if (role !== AdminRole.SUPER_ADMIN) {
      throw new ForbiddenException('Accès réservé aux super administrateurs');
    }
  }
}
