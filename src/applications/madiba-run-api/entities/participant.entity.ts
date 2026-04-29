import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ParticipantDocument = Participant & Document;

// Énumérations pour les valeurs contrôlées
export enum Sexe {
  HOMME = 'HOMME',
  FEMME = 'FEMME',
}

export enum PointDepart {
  DOUALA_5 = 'Mairie Douala 5ème',
  DOUALA_4 = 'Supermarché Santa Lucia',
  DOUALA_3 = 'Mairie Douala 3ème',
  DOUALA_2 = 'Mairie Douala 2ème',
  DOUALA_1 = 'Kadji Square Douala 1er',
  RAS = '== RAS ==',
}

export enum Distance {
  DIX_KM = '10km',
  VINGT_ET_UN_KM = '21km',
  RAS = '== RAS ==',
}

export enum Categorie {
  WALKATHON = 'WALKATHON',
  MARATHON = 'HALF_MARATHON',
}

export enum StatutParticipant {
  EN_ATTENTE = 'EN_ATTENTE',
  VALIDE = 'VALIDE',
  REJETE = 'REJETE',
  ANNULE = 'ANNULE',
}

@Schema({ timestamps: true, collection: 'madiba_run_participants' })
export class Participant {
  @Prop({ required: true, trim: true, maxlength: 100 })
  nom!: string;

  @Prop({ required: true, trim: true, maxlength: 100 })
  prenom!: string;

  @Prop({
    required: true,
    enum: Object.values(Sexe),
  })
  sexe!: Sexe;

  @Prop({ required: true })
  dateNaissance!: Date;

  @Prop({ required: true, trim: true, maxlength: 20 })
  telephone!: string;

  @Prop({ required: true, trim: true, lowercase: true, maxlength: 100 })
  email!: string;

  @Prop({
    required: true,
    enum: Object.values(PointDepart),
  })
  pointDepart!: PointDepart;

  @Prop({ required: true, trim: true, maxlength: 100 })
  quartier!: string;

  @Prop({
    required: true,
    enum: Object.values(Distance),
  })
  distanceParcourir!: Distance;

  @Prop({ 
    required: true,
    enum: Object.values(Categorie),
  })
  categorie!: Categorie;

  @Prop({ required: false, trim: true })
  lienCertificatMedical?: string;

  @Prop({
    required: true,
    enum: Object.values(StatutParticipant),
    default: StatutParticipant.EN_ATTENTE,
  })
  statut!: StatutParticipant;

  @Prop({ unique: true, sparse: true })
  numeroDossard?: string;

  @Prop({ default: false })
  smsEnvoye!: boolean;

  @Prop({ default: false })
  emailEnvoye!: boolean;

  @Prop()
  dateValidation?: Date;

  @Prop({ trim: true })
  contactUrgence?: string;

  @Prop({ trim: true })
  nomContactUrgence?: string;

  @Prop({ trim: true })
  notes?: string;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);

// Index composé pour améliorer les performances de recherche
ParticipantSchema.index({ email: 1 }, { unique: true });
ParticipantSchema.index({ telephone: 1 });
ParticipantSchema.index({ categorie: 1, distanceParcourir: 1 });
ParticipantSchema.index({ statut: 1 });
ParticipantSchema.index({ createdAt: -1 });
