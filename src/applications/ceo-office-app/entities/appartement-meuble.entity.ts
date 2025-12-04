import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppartementMeubleDocument = AppartementMeuble & Document;

@Schema({ timestamps: true })
export class AppartementMeuble {
    @Prop({ required: false })
    bookingId: string;

    @Prop({ required: false })
    employeeName: string;

    @Prop({ required: false })
    employeeFirstName: string;

    @Prop({ required: false })
    employeeCompany: string;

    @Prop({ required: false })
    department: string;

    @Prop({ required: false })
    payerCompany: string;

    @Prop({ required: false })
    nightlyRate: number;

    @Prop({ required: false })
    totalAmount: number;

    @Prop({ required: false })
    currency: string;

    @Prop({ required: false })
    residenceName: string;

    @Prop({ required: false })
    checkInDate: string;

    @Prop({ required: false })
    checkOutDate: string;

    @Prop({ required: false })
    numberOfNights: number;

    @Prop({
        required: true,
        enum: ['CONFIRMED', 'PENDING', 'CANCELLED'],
        default: 'PENDING'
    })
    status: string;
}

export const AppartementMeubleSchema = SchemaFactory.createForClass(AppartementMeuble);
