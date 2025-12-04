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

    @Prop({ required: false })
    entrepriseOccupant?: string;

    @Prop({ required: false })
    entreprisePayante?: string;

    @Prop({ required: false })
    nightlyRate: number;

    @Prop({ required: false })
    numberOfNights: number;

    @Prop({ required: false })
    breakfastAmount: number;

    @Prop({ required: false })
    lunchAmount: number;

    @Prop({ required: false })
    dinnerAmount: number;

    @Prop()
    extrasDescription?: string;

    @Prop({ required: false })
    extrasAmount: number;

    @Prop({ required: false })
    checkInDate: string;

    @Prop({ required: false })
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
