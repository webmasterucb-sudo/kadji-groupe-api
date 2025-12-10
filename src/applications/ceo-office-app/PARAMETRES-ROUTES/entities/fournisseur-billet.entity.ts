import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type FournisseurBilletDocument = HydratedDocument<FournisseurBillet>;

@Schema({ timestamps: true, collection: 'fournisseurs_billets_parametres' })
export class FournisseurBillet extends Document {
    @Prop({ required: true, maxlength: 100 })
    nom: string;

    @Prop({ required: true, maxlength: 255 })
    address: string;

    @Prop({
        required: true,
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE',
    })
    status: 'ACTIVE' | 'INACTIVE';

    createdAt?: Date;
    updatedAt?: Date;
}

export const FournisseurBilletSchema = SchemaFactory.createForClass(FournisseurBillet);
