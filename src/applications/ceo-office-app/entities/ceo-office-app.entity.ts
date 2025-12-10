
// src/travel-tickets/schemas/travel-ticket.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class TravelTicket extends Document {
  @Prop({ required: true, minlength: 2 })
  nom: string;

  @Prop({ required: true, minlength: 2 })
  prenom: string;

  @Prop({ required: true, unique: true, match: /^[A-Z0-9]+$/ })
  matricule: string;

  @Prop({ required: true })
  entreprise: string;

  @Prop({ required: true })
  departement: string;

  @Prop({ required: true })
  fonction: string;

  @Prop({ required: true })
  motifVoyage: string;

  @Prop({ required: false })
  devises: string;

  // @Prop({ required: false, min: 0 })
  prixBilletAvion: number;

  @Prop({ required: false, default: 0 })
  coutAdditionnel: number;

  @Prop({ required: false, default: '' })
  motifCoutAdditionnel: string;

  @Prop({ required: true })
  classe: string;

  @Prop({ required: true })
  projet: string;

  @Prop({ required: false, match: /^[A-Z]{3}$/ })
  provenanceCodeAeroport: string;

  @Prop({ required: false, match: /^[A-Z]{3}$/ })
  destinationCodeAeroport: string;

  @Prop({ required: false })
  paysProvenance: string;

  @Prop({ required: false })
  paysDestination: string;

  @Prop({ required: true })
  dateDepart: Date;

  @Prop({ required: true })
  dateRetour: Date;

  @Prop({ required: true, enum: ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'PAID'], default: 'SUBMITTED' })
  status: string;

  @Prop({ required: false })
  agenceVoyage: string;

  @Prop({ required: false })
  submittedAt: Date;

  @Prop({ required: false })
  approvedAt: Date;

  @Prop({ required: false })
  approvedById: string;

  @Prop({ required: false })
  adminEmail: string;
}

export const TravelTicketSchema = SchemaFactory.createForClass(TravelTicket);



