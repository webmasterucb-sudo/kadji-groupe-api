import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ContactForm extends Document {


    @Prop({ required: true, minlength: 2, maxlength: 200 })
    nom: string;


    @Prop({ required: true, minlength: 3, maxlength: 200 })
    prenom: string;

    @Prop({ required: true, minlength: 8, maxlength: 100 })
    phone: string;

    @Prop({ required: true, })
    email: string;

    @Prop({ required: true, minlength: 20, maxlength: 5000 })
    message: string;

    @Prop({ required: true, enum: ['homme', 'femme',] })
    sexe: string;


}

export const ContactFormSchema = SchemaFactory.createForClass(ContactForm);
