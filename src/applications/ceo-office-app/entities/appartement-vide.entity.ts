import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppartementVideDocument = AppartementVide & Document;

@Schema({ timestamps: true })
export class AppartementVide {
    @Prop({ required: true, default: '' })
    employeeName: string;

    @Prop({ required: true, default: '' })
    employeeCompany: string;

    @Prop({ required: true, default: '' })
    department: string;

    @Prop({ required: true, default: '' })
    payerCompany: string;

    @Prop({ required: true, default: 0 })
    monthlyRent: number;

    @Prop({ required: true, default: 0 })
    securityDeposit: number;

    @Prop({ required: true, default: '' })
    currency: string;

    @Prop({ required: true, default: '' })
    residenceName: string;

    @Prop({
        required: true,
        enum: ['STUDIO', '2CHAM', '3CHAM', '4CHAM']
    })
    apartmentType: string;

    @Prop({ required: true, default: '' })
    startDate: string;

    @Prop({ required: true, default: '' })
    endDate: string;

    @Prop({ required: true, default: false })
    isRenewAlertActive: boolean;

    @Prop({ required: true, default: 0 })
    daysRemaining: number;


    @Prop({ required: true, enum: ['RESERVE', 'CONFIRME', 'ANNULE', 'FACTURE', 'PAYE'], default: 'RESERVE' })
    status: 'RESERVE' | 'CONFIRME' | 'ANNULE' | 'FACTURE' | 'PAYE';

    @Prop({ required: true, default: '' })
    notes: string;
}

export const AppartementVideSchema = SchemaFactory.createForClass(AppartementVide);
