import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MissionExpenseDocument = MissionExpense & Document;

@Schema({ timestamps: true })
export class MissionExpense {
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  prenom: string;

  @Prop({ required: false })
  matricule: string;

  @Prop({ required: false, default: '' })
  entreprise: string;

  @Prop({ required: false, default: '' })
  departement: string;

  @Prop({ required: false, default: '' })
  pays: string;

  @Prop({ required: false, default: 0 })
  nombreDeJours: number;

  @Prop({ required: false, default: '' })
  devise: string;

  @Prop({ required: false, default: 0 })
  montant: number;

  @Prop({ required: false, default: '' })
  motif: string;

  @Prop({
    required: false,
    enum: ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'PAID'],
    default: 'DRAFT',
  })
  status: string;

  @Prop()
  submittedAt?: string;

  @Prop()
  approvedAt?: string;

  @Prop()
  approvedById?: string;

  @Prop({ required: false })
  createdById: string;
}

export const MissionExpenseSchema =
  SchemaFactory.createForClass(MissionExpense);
