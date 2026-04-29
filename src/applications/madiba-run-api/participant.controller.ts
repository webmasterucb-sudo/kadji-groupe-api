import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  Header,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ParticipantService } from './participant.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import {
  FilterParticipantDto,
  PaginationDto,
  UpdateStatutDto,
  AssignerDossardDto,
} from './dto/participant-common.dto';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';

/**
 * Contrôleur pour la gestion des participants au Madiba Run
 * Routes publiques pour l'inscription, routes protégées pour l'administration
 */
@Controller('madiba-run/participants')
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  // ==================== ROUTES PUBLIQUES ====================

  /**
   * Inscription d'un nouveau participant (route publique)
   * POST /madiba-run/participants/register
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createParticipantDto: CreateParticipantDto) {
    const result = await this.participantService.create(createParticipantDto);
    return {
      success: true,
      message: 'Inscription réussie! Vous recevrez une confirmation par SMS et email.',
      data: {
        participant: {
          id: (result.participant as any)._id,
          nom: result.participant.nom,
          prenom: result.participant.prenom,
          email: result.participant.email,
          categorie: result.participant.categorie,
          distanceParcourir: result.participant.distanceParcourir,
          pointDepart: result.participant.pointDepart,
          statut: result.participant.statut,
        },
        notifications: result.notifications,
      },
    };
  }

  /**
   * Upload du certificat médical (route publique)
   * POST /madiba-run/participants/:id/certificat
   */
  @Post(':id/certificat')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async uploadCertificat(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(pdf|jpeg|jpg|png)$/i }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const participant = await this.participantService.uploadCertificat(id, file);
    return {
      success: true,
      message: 'Certificat médical uploadé avec succès',
      data: {
        lienCertificatMedical: participant.lienCertificatMedical,
      },
    };
  }

  /**
   * Vérifier le statut d'inscription par email (route publique)
   * GET /madiba-run/participants/check-status?email=xxx
   */
  @Get('check-status')
  async checkStatus(@Query('email') email: string) {
    const participant = await this.participantService.findByEmail(email);
    return {
      success: true,
      data: {
        nom: participant.nom,
        prenom: participant.prenom,
        categorie: participant.categorie,
        distanceParcourir: participant.distanceParcourir,
        pointDepart: participant.pointDepart,
        statut: participant.statut,
        numeroDossard: participant.numeroDossard,
        certificatUploade: !!participant.lienCertificatMedical,
      },
    };
  }

  // ==================== ROUTES PROTÉGÉES (ADMIN) ====================

  /**
   * Créer un participant (admin)
   * POST /madiba-run/participants
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createParticipantDto: CreateParticipantDto) {
    return this.participantService.create(createParticipantDto);
  }

  /**
   * Récupérer tous les participants avec filtres et pagination
   * GET /madiba-run/participants
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() filters: FilterParticipantDto,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    const pagination: PaginationDto = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc',
    };

    const result = await this.participantService.findAll(filters, pagination);
    return {
      success: true,
      ...result,
    };
  }

  /**
   * Obtenir les statistiques du tableau de bord
   * GET /madiba-run/participants/stats
   */
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats() {
    const stats = await this.participantService.getStats();
    return {
      success: true,
      data: stats,
    };
  }

  /**
   * Exporter les participants en CSV
   * GET /madiba-run/participants/export/csv
   */
  @Get('export/csv')
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="participants-madiba-run.csv"')
  async exportCsv(@Query() filters: FilterParticipantDto, @Res() res: Response) {
    const csv = await this.participantService.exportToCsv(filters);
    // Ajouter BOM pour Excel
    res.send('\ufeff' + csv);
  }

  /**
   * Rechercher par numéro de dossard
   * GET /madiba-run/participants/dossard/:numeroDossard
   */
  @Get('dossard/:numeroDossard')
  @UseGuards(JwtAuthGuard)
  async findByDossard(@Param('numeroDossard') numeroDossard: string) {
    const participant = await this.participantService.findByDossard(numeroDossard);
    return {
      success: true,
      data: participant,
    };
  }

  /**
   * Rechercher par téléphone
   * GET /madiba-run/participants/telephone/:telephone
   */
  @Get('telephone/:telephone')
  @UseGuards(JwtAuthGuard)
  async findByTelephone(@Param('telephone') telephone: string) {
    const participant = await this.participantService.findByTelephone(telephone);
    return {
      success: true,
      data: participant,
    };
  }

  /**
   * Récupérer un participant par ID
   * GET /madiba-run/participants/:id
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const participant = await this.participantService.findOne(id);
    return {
      success: true,
      data: participant,
    };
  }

  /**
   * Mettre à jour un participant
   * PATCH /madiba-run/participants/:id
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateParticipantDto: UpdateParticipantDto,
  ) {
    const participant = await this.participantService.update(
      id,
      updateParticipantDto,
    );
    return {
      success: true,
      message: 'Participant mis à jour avec succès',
      data: participant,
    };
  }

  /**
   * Mettre à jour le statut d'un participant
   * PATCH /madiba-run/participants/:id/statut
   */
  @Patch(':id/statut')
  @UseGuards(JwtAuthGuard)
  async updateStatut(
    @Param('id') id: string,
    @Body() updateStatutDto: UpdateStatutDto,
  ) {
    const participant = await this.participantService.updateStatut(
      id,
      updateStatutDto,
    );
    return {
      success: true,
      message: 'Statut mis à jour avec succès',
      data: participant,
    };
  }

  /**
   * Assigner un numéro de dossard
   * PATCH /madiba-run/participants/:id/dossard
   */
  @Patch(':id/dossard')
  @UseGuards(JwtAuthGuard)
  async assignerDossard(
    @Param('id') id: string,
    @Body() assignerDossardDto: AssignerDossardDto,
  ) {
    const participant = await this.participantService.assignerDossard(
      id,
      assignerDossardDto,
    );
    return {
      success: true,
      message: `Dossard ${assignerDossardDto.numeroDossard} attribué avec succès`,
      data: participant,
    };
  }

  /**
   * Renvoyer les notifications (SMS et email)
   * POST /madiba-run/participants/:id/resend-notifications
   */
  @Post(':id/resend-notifications')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async resendNotifications(@Param('id') id: string) {
    const notifications = await this.participantService.resendNotifications(id);
    return {
      success: true,
      message: 'Notifications renvoyées',
      data: notifications,
    };
  }

  /**
   * Supprimer un participant
   * DELETE /madiba-run/participants/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.participantService.remove(id);
  }
}
