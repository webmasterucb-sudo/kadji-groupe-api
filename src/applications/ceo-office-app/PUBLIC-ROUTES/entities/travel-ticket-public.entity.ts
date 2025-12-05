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
    projet: string;

    @Prop({ required: true })
    dateDepart: Date;

    @Prop({ required: true })
    dateRetour: Date;

    @Prop({ required: true, enum: ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'PAID'], default: 'SUBMITTED' })
    status: string;

    @Prop({ required: false })
    submittedAt: Date;

    @Prop({ required: false })
    approvedAt: Date;

    @Prop({ required: false })
    emailValidateur?: string;

    @Prop({ required: false })
    approvedById: string;
}

export const TravelTicketPublicSchema = SchemaFactory.createForClass(TravelTicket);

