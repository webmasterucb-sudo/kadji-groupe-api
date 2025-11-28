import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MissionExpenseDocument = MissionExpense & Document;

@Schema({ timestamps: true })
export class MissionExpense {
    @Prop({ required: true })
    nom: string;

    @Prop({ required: true })
    prenom: string;

    @Prop({ required: true })
    matricule: string;

    @Prop({ required: true })
    entreprise: string;

    @Prop({ required: true })
    departement: string;

    @Prop({ required: true })
    pays: string;

    @Prop({ required: true })
    nombreDeJours: number;

    @Prop({ required: true })
    devise: string;

    @Prop({ required: true })
    montant: number;

    @Prop({ required: true })
    motif: string;

    @Prop({
        required: true,
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

    @Prop({ required: true })
    createdById: string;
}

export const MissionExpenseSchema = SchemaFactory.createForClass(MissionExpense);
