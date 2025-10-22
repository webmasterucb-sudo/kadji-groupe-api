// export class OffresEmplois {}


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JobOfferDocument = JobOffer & Document;

@Schema({ timestamps: true })
export class JobOffer {
    @Prop({ required: true, trim: true, maxlength: 500 })
    title: string;

    @Prop({ required: true, maxlength: 5000 })
    description: string;

    @Prop({ required: true, trim: true, maxlength: 100 })
    departement: string;

    @Prop({ required: true, trim: true, maxlength: 100 })
    niveauEtude: string;

    @Prop({ required: true, trim: true, maxlength: 100 })
    lieuxTravail: string;

    @Prop({ min: 0 })
    salaire?: number;

    @Prop({
        required: true,
        enum: ['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance']
    })
    contractType: string;

    @Prop({ type: String, default: '' })
    experience: string;

    @Prop({ type: String, default: '' })
    skills: string;

    @Prop({ type: String, default: '' })
    benefits?: string;

    @Prop({ type: String, default: '' })
    requirements: string;

    @Prop({
        validate: {
            validator: function (date: Date) {
                return !date || date > new Date();
            },
            message: 'La date limite de candidature doit être dans le futur'
        }
    })
    applicationDeadline?: Date;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: 0, min: 0 })
    totalPostuleNumber: number;

    @Prop({ trim: true })
    linkToApply: string;
}

export const JobOfferSchema = SchemaFactory.createForClass(JobOffer);


