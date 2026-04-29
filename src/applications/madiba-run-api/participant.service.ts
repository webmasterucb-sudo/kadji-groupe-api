import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import {
  Participant,
  ParticipantDocument,
  StatutParticipant,
} from './entities/participant.entity';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import {
  FilterParticipantDto,
  PaginationDto,
  DashboardStatsDto,
  UpdateStatutDto,
  AssignerDossardDto,
} from './dto/participant-common.dto';
import { NotificationService } from './services/notification.service';
import { FileUploadService } from './services/file-upload.service';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ParticipantService {
  private readonly logger = new Logger(ParticipantService.name);

  constructor(
    @InjectModel(Participant.name)
    private participantModel: Model<ParticipantDocument>,
    private readonly notificationService: NotificationService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  /**
   * Créer un nouveau participant et envoyer les notifications
   */
  async create(createParticipantDto: CreateParticipantDto): Promise<{
    participant: Participant;
    notifications: {
      sms: { success: boolean; message: string };
      email: { success: boolean; message: string };
    };
  }> {
    try {
      // Vérification de l'unicité de l'email
      const existingByEmail = await this.participantModel
        .findOne({ email: createParticipantDto.email.toLowerCase() })
        .exec();
      
      if (existingByEmail) {
        throw new ConflictException(
          'Un participant avec cet email est déjà inscrit',
        );
      }

      // Vérification de l'unicité du téléphone
      const existingByPhone = await this.participantModel
        .findOne({ telephone: createParticipantDto.telephone })
        .exec();
      
      if (existingByPhone) {
        throw new ConflictException(
          'Un participant avec ce numéro de téléphone est déjà inscrit',
        );
      }

      // Création du participant
      const createdParticipant = new this.participantModel({
        ...createParticipantDto,
        email: createParticipantDto.email.toLowerCase(),
        statut: StatutParticipant.VALIDE,
      });

      const savedParticipant = await createdParticipant.save();
      this.logger.log(`Nouveau participant créé: ${savedParticipant._id}`);

      // Envoi des notifications (SMS et Email)
      const notifications = await this.notificationService.sendAllNotifications(
        savedParticipant,
      );

      // Mise à jour des flags de notification
      await this.participantModel.findByIdAndUpdate(savedParticipant._id, {
        smsEnvoye: notifications.sms.success,
        emailEnvoye: notifications.email.success,
      });

      return {
        participant: savedParticipant,
        notifications,
      };
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException(
          'Un participant avec ces informations existe déjà',
        );
      }
      throw error;
    }
  }

  /**
   * Récupérer tous les participants avec pagination et filtres
   */
  async findAll(
    filters: FilterParticipantDto = {},
    pagination: PaginationDto = {},
  ): Promise<PaginatedResult<Participant>> {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    const query = this.buildFilterQuery(filters);

    const [data, total] = await Promise.all([
      this.participantModel
        .find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.participantModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  
  /**
   * Récupérer un participant par son ID
   */
  async findOne(id: string): Promise<Participant> {
    const participant = await this.participantModel.findById(id).exec();
    if (!participant) {
      throw new NotFoundException(`Participant avec l'ID ${id} non trouvé`);
    }
    return participant;
  }

  /**
   * Récupérer un participant par email
   */
  async findByEmail(email: string): Promise<Participant> {
    const participant = await this.participantModel
      .findOne({ email: email.toLowerCase() })
      .exec();
    if (!participant) {
      throw new NotFoundException(`Participant avec l'email ${email} non trouvé`);
    }
    return participant;
  }

  /**
   * Récupérer un participant par numéro de téléphone
   */
  async findByTelephone(telephone: string): Promise<Participant> {
    const participant = await this.participantModel
      .findOne({ telephone })
      .exec();
    if (!participant) {
      throw new NotFoundException(
        `Participant avec le téléphone ${telephone} non trouvé`,
      );
    }
    return participant;
  }

  /**
   * Récupérer un participant par numéro de dossard
   */
  async findByDossard(numeroDossard: string): Promise<Participant> {
    const participant = await this.participantModel
      .findOne({ numeroDossard })
      .exec();
    if (!participant) {
      throw new NotFoundException(
        `Participant avec le dossard ${numeroDossard} non trouvé`,
      );
    }
    return participant;
  }

  /**
   * Mettre à jour un participant
   */
  async update(
    id: string,
    updateParticipantDto: UpdateParticipantDto,
  ): Promise<Participant> {
    try {
      // Vérification de l'email si modifié
      if (updateParticipantDto.email) {
        const existing = await this.participantModel.findOne({
          email: updateParticipantDto.email.toLowerCase(),
          _id: { $ne: id },
        });
        if (existing) {
          throw new ConflictException('Cet email est déjà utilisé');
        }
      }

      const updatedParticipant = await this.participantModel
        .findByIdAndUpdate(
          id,
          {
            ...updateParticipantDto,
            ...(updateParticipantDto.email && {
              email: updateParticipantDto.email.toLowerCase(),
            }),
          },
          { new: true },
        )
        .exec();

      if (!updatedParticipant) {
        throw new NotFoundException(`Participant avec l'ID ${id} non trouvé`);
      }

      return updatedParticipant;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('Ces informations sont déjà utilisées');
      }
      throw error;
    }
  }

  /**
   * Mettre à jour le statut d'un participant
   */
  async updateStatut(
    id: string,
    updateStatutDto: UpdateStatutDto,
  ): Promise<Participant> {
    const participant = await this.findOne(id);

    const updateData: Partial<Participant> = {
      statut: updateStatutDto.statut,
      ...(updateStatutDto.notes && { notes: updateStatutDto.notes }),
    };

    if (updateStatutDto.statut === StatutParticipant.VALIDE) {
      updateData.dateValidation = new Date();
      // Envoyer SMS de validation
      await this.notificationService.sendValidationSms(participant);
    }

    const updatedParticipant = await this.participantModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    return updatedParticipant!;
  }

  /**
   * Assigner un numéro de dossard à un participant
   */
  async assignerDossard(
    id: string,
    assignerDossardDto: AssignerDossardDto,
  ): Promise<Participant> {
    // Vérification que le dossard n'est pas déjà attribué
    const existingDossard = await this.participantModel.findOne({
      numeroDossard: assignerDossardDto.numeroDossard,
      _id: { $ne: id },
    });

    if (existingDossard) {
      throw new ConflictException(
        `Le dossard ${assignerDossardDto.numeroDossard} est déjà attribué`,
      );
    }

    const updatedParticipant = await this.participantModel
      .findByIdAndUpdate(
        id,
        { numeroDossard: assignerDossardDto.numeroDossard },
        { new: true },
      )
      .exec();

    if (!updatedParticipant) {
      throw new NotFoundException(`Participant avec l'ID ${id} non trouvé`);
    }

    return updatedParticipant;
  }

  /**
   * Upload du certificat médical
   */
  async uploadCertificat(
    id: string,
    file: Express.Multer.File,
  ): Promise<Participant> {
    const participant = await this.findOne(id);

    const uploadResult = await this.fileUploadService.uploadCertificatMedical(
      file,
      id,
      `${participant.nom}_${participant.prenom}`,
    );

    if (!uploadResult.success) {
      throw new BadRequestException(uploadResult.message);
    }

    // Supprimer l'ancien certificat si existant
    if (participant.lienCertificatMedical) {
      await this.fileUploadService.deleteCertificatMedical(
        participant.lienCertificatMedical,
      );
    }

    const updatedParticipant = await this.participantModel
      .findByIdAndUpdate(
        id,
        { lienCertificatMedical: uploadResult.url },
        { new: true },
      )
      .exec();

    return updatedParticipant!;
  }

  /**
   * Supprimer un participant
   */
  async remove(id: string): Promise<Participant> {
    const deletedParticipant = await this.participantModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedParticipant) {
      throw new NotFoundException(`Participant avec l'ID ${id} non trouvé`);
    }

    // Supprimer le certificat médical si existant
    if (deletedParticipant.lienCertificatMedical) {
      await this.fileUploadService.deleteCertificatMedical(
        deletedParticipant.lienCertificatMedical,
      );
    }

    return deletedParticipant;
  }

  /**
   * Obtenir les statistiques pour le tableau de bord
   */
  async getStats(): Promise<DashboardStatsDto> {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalParticipants,
      byCategorie,
      byDistance,
      byStatut,
      bySexe,
      byPointDepart,
      inscriptionsAujourdhui,
      inscriptionsCetteSemaine,
      inscriptionsCeMois,
    ] = await Promise.all([
      this.participantModel.countDocuments().exec(),
      this.participantModel.aggregate([
        { $group: { _id: '$categorie', count: { $sum: 1 } } },
      ]),
      this.participantModel.aggregate([
        { $group: { _id: '$distanceParcourir', count: { $sum: 1 } } },
      ]),
      this.participantModel.aggregate([
        { $group: { _id: '$statut', count: { $sum: 1 } } },
      ]),
      this.participantModel.aggregate([
        { $group: { _id: '$sexe', count: { $sum: 1 } } },
      ]),
      this.participantModel.aggregate([
        { $group: { _id: '$pointDepart', count: { $sum: 1 } } },
      ]),
      this.participantModel.countDocuments({
        createdAt: { $gte: startOfDay },
      }),
      this.participantModel.countDocuments({
        createdAt: { $gte: startOfWeek },
      }),
      this.participantModel.countDocuments({
        createdAt: { $gte: startOfMonth },
      }),
    ]);

    return {
      totalParticipants,
      participantsParCategorie: this.aggregateToObject(byCategorie),
      participantsParDistance: this.aggregateToObject(byDistance),
      participantsParStatut: this.aggregateToObject(byStatut),
      participantsParSexe: this.aggregateToObject(bySexe),
      participantsParPointDepart: this.aggregateToObject(byPointDepart),
      inscriptionsAujourdhui,
      inscriptionsCetteSemaine,
      inscriptionsCeMois,
    };
  }

  /**
   * Renvoyer les notifications à un participant
   */
  async resendNotifications(id: string): Promise<{
    sms: { success: boolean; message: string };
    email: { success: boolean; message: string };
  }> {
    const participant = await this.findOne(id);
    const notifications = await this.notificationService.sendAllNotifications(
      participant,
    );

    await this.participantModel.findByIdAndUpdate(id, {
      smsEnvoye: notifications.sms.success,
      emailEnvoye: notifications.email.success,
    });

    return notifications;
  }

  /**
   * Exporter les participants au format CSV
   */
  async exportToCsv(filters: FilterParticipantDto = {}): Promise<string> {
    const query = this.buildFilterQuery(filters);
    const participants = await this.participantModel
      .find(query)
      .sort({ createdAt: -1 })
      .exec();

    const headers = [
      'Nom',
      'Prénom',
      'Sexe',
      'Date de naissance',
      'Téléphone',
      'Email',
      'Point de départ',
      'Quartier',
      'Distance',
      'Catégorie',
      'Statut',
      'N° Dossard',
      'Date inscription',
    ];

    const rows = participants.map((p) => [
      p.nom,
      p.prenom,
      p.sexe,
      p.dateNaissance?.toISOString().split('T')[0] || '',
      p.telephone,
      p.email,
      p.pointDepart,
      p.quartier,
      p.distanceParcourir,
      p.categorie,
      p.statut,
      p.numeroDossard || '',
      (p as any).createdAt?.toISOString() || '',
    ]);

    const csv = [
      headers.join(';'),
      ...rows.map((row) => row.join(';')),
    ].join('\n');

    return csv;
  }
  
  /**
   * Construit la requête de filtrage
   */
  private buildFilterQuery(
    filters: FilterParticipantDto,
  ): FilterQuery<ParticipantDocument> {
    const query: FilterQuery<ParticipantDocument> = {};

    if (filters.nom) {
      query.nom = { $regex: filters.nom, $options: 'i' };
    }
    if (filters.prenom) {
      query.prenom = { $regex: filters.prenom, $options: 'i' };
    }
    if (filters.email) {
      query.email = { $regex: filters.email, $options: 'i' };
    }
    if (filters.telephone) {
      query.telephone = { $regex: filters.telephone, $options: 'i' };
    }
    if (filters.sexe) {
      query.sexe = filters.sexe;
    }
    if (filters.categorie) {
      query.categorie = filters.categorie;
    }
    if (filters.distanceParcourir) {
      query.distanceParcourir = filters.distanceParcourir;
    }
    if (filters.statut) {
      query.statut = filters.statut;
    }
    if (filters.pointDepart) {
      query.pointDepart = filters.pointDepart;
    }
    if (filters.numeroDossard) {
      query.numeroDossard = filters.numeroDossard;
    }

    return query;
  }

  /**
   * Transforme le résultat d'agrégation en objet
   */
  private aggregateToObject(
    results: Array<{ _id: string; count: number }>,
  ): Record<string, number> {
    return results.reduce(
      (acc, item) => {
        if (item._id) {
          acc[item._id] = item.count;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
  }
}
