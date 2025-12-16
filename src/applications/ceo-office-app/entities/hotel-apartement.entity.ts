import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HotelApartementDocument = HotelApartement & Document;

@Schema({ timestamps: true })
export class HotelApartement {
  @Prop({ required: false, default: '' })
  hotelName: string;

  @Prop({ required: true, default: '' })
  nomOccupant: string;

  @Prop({ required: false, default: '' })
  prenomOccupant: string;

  @Prop({ required: false, default: '' })
  entrepriseOccupant?: string;

  @Prop({ required: false, default: '' })
  entreprisePayante?: string;

  @Prop({ required: false, default: 0 })
  nightlyRate: number;

  @Prop({ required: false, default: 0 })
  numberOfNights: number;

  @Prop({ required: false, default: 0 })
  breakfastAmount: number;

  @Prop({ required: false, default: 0 })
  lunchAmount: number;

  @Prop({ required: false, default: 0 })
  dinnerAmount: number;

  @Prop({ required: false, default: '' })
  extrasDescription?: string;

  @Prop({ required: false, default: 0 })
  extrasAmount: number;

  @Prop({ required: false, default: new Date() })
  checkInDate: Date;

  @Prop({ required: false, default: new Date() })
  checkOutDate: Date;

  @Prop({ required: false, default: '' })
  ville: string;

  @Prop({ required: false, default: '' })
  paysDestination: string;

  @Prop({ required: false, default: 0 })
  totalAmount?: number;

  @Prop({ required: false, default: '' })
  currency?: string;

  @Prop({
    enum: ['RESERVE', 'CONFIRME', 'ANNULE', 'FACTURE'],
    default: 'RESERVE',
  })
  status?: string;

  @Prop({ required: false, default: '' })
  notes?: string;

  @Prop({ required: false, default: '' })
  createdById?: string;
}

export const HotelApartementSchema =
  SchemaFactory.createForClass(HotelApartement);
