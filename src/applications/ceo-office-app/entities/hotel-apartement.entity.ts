import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HotelApartementDocument = HotelApartement & Document;

@Schema({ timestamps: true })
export class HotelApartement {
    @Prop({ required: true })
    hotelName: string;

    @Prop({ required: true })
    nomOccupant: string;

    @Prop({ required: true })
    prenomOccupant: string;

    @Prop({ required: true })
    nightlyRate: number;

    @Prop({ required: true })
    numberOfNights: number;

    @Prop({ required: true })
    breakfastAmount: number;

    @Prop({ required: true })
    lunchAmount: number;

    @Prop({ required: true })
    dinnerAmount: number;

    @Prop()
    extrasDescription?: string;

    @Prop({ required: true })
    extrasAmount: number;

    @Prop({ required: true })
    checkInDate: string;

    @Prop({ required: true })
    checkOutDate: string;

    @Prop()
    totalAmount?: number;

    @Prop()
    currency?: string;

    @Prop({
        enum: ['RESERVE', 'CONFIRME', 'ANNULE', 'FACTURE'],
        default: 'RESERVE',
    })
    status?: string;

    @Prop()
    notes?: string;

    @Prop()
    createdById?: string;
}

export const HotelApartementSchema = SchemaFactory.createForClass(HotelApartement);
