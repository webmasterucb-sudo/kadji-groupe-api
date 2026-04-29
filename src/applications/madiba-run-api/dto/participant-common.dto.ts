import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { Categorie, Distance, Sexe, StatutParticipant } from '../entities/participant.entity';

/**
 * DTO pour l'upload du certificat médical
 */
export class UploadCertificatDto {
  @IsString({ message: 'L\'ID du participant doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'L\'ID du participant est obligatoire' })
  participantId!: string;
}

/**
 * DTO pour la recherche/filtrage des participants
 */
export class FilterParticipantDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  prenom?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsEnum(Sexe)
  sexe?: Sexe;

  @IsOptional()
  @IsEnum(Categorie)
  categorie?: Categorie;

  @IsOptional()
  @IsEnum(Distance)
  distanceParcourir?: Distance;

  @IsOptional()
  @IsEnum(StatutParticipant)
  statut?: StatutParticipant;

  @IsOptional()
  @IsString()
  pointDepart?: string;

  @IsOptional()
  @IsString()
  numeroDossard?: string;
}

/**
 * DTO pour la pagination
 */
export class PaginationDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 20;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

/**
 * DTO pour les statistiques du tableau de bord
 */
export class DashboardStatsDto {
  totalParticipants!: number;
  participantsParCategorie!: Record<string, number>;
  participantsParDistance!: Record<string, number>;
  participantsParStatut!: Record<string, number>;
  participantsParSexe!: Record<string, number>;
  participantsParPointDepart!: Record<string, number>;
  inscriptionsAujourdhui!: number;
  inscriptionsCetteSemaine!: number;
  inscriptionsCeMois!: number;
}

/**
 * DTO pour la validation du statut d'un participant
 */
export class UpdateStatutDto {
  @IsEnum(StatutParticipant, {
    message: 'Le statut doit être une valeur valide',
  })
  @IsNotEmpty({ message: 'Le statut est obligatoire' })
  statut!: StatutParticipant;

  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * DTO pour l'attribution de dossard
 */
export class AssignerDossardDto {
  @IsString({ message: 'Le numéro de dossard doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le numéro de dossard est obligatoire' })
  numeroDossard!: string;
}
