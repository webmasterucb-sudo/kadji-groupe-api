import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type HotelParametreDocument = HydratedDocument<HotelParametre>;

@Schema({ timestamps: true, collection: 'hotels_parametres' })
export class HotelParametre extends Document {
    @Prop({ required: true, unique: true, maxlength: 100 })
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
}

export const HotelParametreSchema =
    SchemaFactory.createForClass(HotelParametre);
