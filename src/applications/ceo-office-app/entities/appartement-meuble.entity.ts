import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppartementMeubleDocument = AppartementMeuble & Document;

@Schema({ timestamps: true })
export class AppartementMeuble {
    @Prop({ required: false, default: '' })
    bookingId: string;

    @Prop({ required: false, default: '' })
    employeeName: string;

    @Prop({ required: false, default: '' })
    employeeFirstName: string;

    @Prop({ required: false, default: '' })
    employeeCompany: string;

    @Prop({ required: false, default: '' })
    department: string;

    @Prop({ required: false, default: '' })
    payerCompany: string;

    @Prop({ required: false, default: 0 })
    nightlyRate: number;

    @Prop({ required: false, default: 0 })
    totalAmount: number;

    @Prop({ required: false, default: '' })
    currency: string;

    @Prop({ required: false, default: '' })
    residenceName: string;

    @Prop({ required: false, default: '' })
    checkInDate: string;

    @Prop({ required: false, default: '' })
    checkOutDate: string;

    @Prop({ required: false, default: 0 })
    numberOfNights: number;

    @Prop({
        required: true,
        enum: ['CONFIRMED', 'PENDING', 'CANCELLED'],
        default: 'PENDING'
    })
    status: string;
}

export const AppartementMeubleSchema = SchemaFactory.createForClass(AppartementMeuble);
