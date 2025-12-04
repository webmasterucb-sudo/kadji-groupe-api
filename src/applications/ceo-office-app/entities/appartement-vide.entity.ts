import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppartementVideDocument = AppartementVide & Document;

@Schema({ timestamps: true })
export class AppartementVide {
    @Prop({ required: true })
    employeeName: string;

    @Prop({ required: true })
    employeeCompany: string;

    @Prop({ required: true })
    department: string;

    @Prop({ required: true })
    payerCompany: string;

    @Prop({ required: true })
    monthlyRent: number;

    @Prop({ required: true })
    securityDeposit: number;

    @Prop({ required: true })
    currency: string;

    @Prop({ required: true })
    residenceName: string;

    @Prop({
        required: true,
        enum: ['STUDIO', '2CHAM', '3CHAM', '4CHAM']
    })
    apartmentType: string;

    @Prop({ required: true })
    startDate: string;

    @Prop({ required: true })
    endDate: string;

    @Prop({ required: true, default: false })
    isRenewAlertActive: boolean;

    @Prop({ required: true, default: 0 })
    daysRemaining: number;
}

export const AppartementVideSchema = SchemaFactory.createForClass(AppartementVide);
