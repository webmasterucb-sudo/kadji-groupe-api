import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type EntrepriseDocument = HydratedDocument<Entreprise>;

@Schema({ timestamps: true, collection: 'entreprises_parametres' })
export class Entreprise extends Document {
    @Prop({ required: true, maxlength: 100 })
    nom: string;

    @Prop({ maxlength: 20 })
    telephone?: string;

    @Prop({ maxlength: 255 })
    email?: string;

    @Prop({ maxlength: 500 })
    adresse?: string;

    @Prop({
        required: true,
        type: String,
        enum: ['INTERNE', 'EXTERNE'],
        default: 'EXTERNE',
    })
    status: 'INTERNE' | 'EXTERNE';

    createdAt?: Date;
    updatedAt?: Date;
}

export const EntrepriseSchema = SchemaFactory.createForClass(Entreprise);
