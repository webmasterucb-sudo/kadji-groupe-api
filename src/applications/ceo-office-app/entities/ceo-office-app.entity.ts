
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

  @Prop({ required: true })
  devises: string;

  @Prop({ required: true, min: 0 })
  prixBilletAvion: number;

  @Prop({ required: true })
  classe: string;

  @Prop({ required: true })
  projet: string;

  @Prop({ required: true, match: /^[A-Z]{3}$/ })
  provenanceCodeAeroport: string;

  @Prop({ required: true, match: /^[A-Z]{3}$/ })
  destinationCodeAeroport: string;

  @Prop({ required: true })
  dateDepart: Date;

  @Prop({ required: true })
  dateRetour: Date;
}

export const TravelTicketSchema = SchemaFactory.createForClass(TravelTicket);
