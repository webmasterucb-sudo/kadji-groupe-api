// src/travel-tickets/schemas/travel-ticket.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: false })
export class TravelTicket extends Document {
  @Prop({ required: false, minlength: 2, default: '' })
  nom: string;

  @Prop({ required: false, minlength: 2, default: '' })
  prenom: string;

  @Prop({ required: false, unique: false, default: '' })
  matricule: string;

  @Prop({ required: false, default: '' })
  entreprise: string;

  @Prop({ required: false, default: '' })
  departement: string;

  @Prop({ required: false, default: '' })
  fonction: string;

  @Prop({ required: false, match: /^\S+@\S+\.\S+$/ })
  emailDemandeur: string;

  @Prop({ required: false, default: '' })
  motifVoyage: string;

  @Prop({ required: false, default: '' })
  devises: string;

  @Prop({ required: false, min: 0 })
  prixBilletAvion: number;

  @Prop({ required: false, default: 0 })
  coutAdditionnel: number;

  @Prop({ required: false, default: '' })
  motifCoutAdditionnel: string;

  @Prop({ required: false, default: '' })
  classe: string;

  @Prop({ required: false, default: '' })
  projet: string;

  @Prop({ required: false, match: /^[A-Z]{3}$/ })
  provenanceCodeAeroport: string;

  @Prop({ required: false, match: /^[A-Z]{3}$/ })
  destinationCodeAeroport: string;

  @Prop({ required: false, default: '' })
  villeProvenance: string;

  @Prop({ required: false, default: '' })
  villeDestination: string;

  @Prop({ required: false, default: new Date() })
  dateDepart: Date;

  @Prop({ required: false, default: new Date() })
  dateRetour: Date;

  @Prop({
    required: false,
    enum: [
      'CANCELLED',
      'SUBMITTED',
      'APPROVED',
      'REJECTED',
      'ON_PROCESSING',
      'PAID',
    ],
    default: 'SUBMITTED',
  })
  status: string;

  @Prop({ required: false, default: '' })
  agenceVoyage: string;

  @Prop({ required: false, default: new Date() })
  submittedAt: Date;

  @Prop({ required: false, default: new Date() })
  approvedAt: Date;

  @Prop({ required: false, default: '' })
  approvedById: string;

  @Prop({ required: false, match: /^\S+@\S+\.\S+$/ })
  adminEmail: string;

  @Prop({ required: false, default: false })
  isDemandeurData: boolean;
}

export const TravelTicketSchema = SchemaFactory.createForClass(TravelTicket);
