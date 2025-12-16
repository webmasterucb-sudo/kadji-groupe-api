import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type ValidateurEmailDocument = HydratedDocument<ValidateurEmail>;

@Schema({ timestamps: true, collection: 'validateurs_emails_parametres' })
export class ValidateurEmail extends Document {
  @Prop({ required: true, unique: true, maxlength: 255 })
  email: string;

  @Prop({ required: true, maxlength: 100 })
  entreprise: string;

  @Prop({
    required: true,
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE',
  })
  status: 'ACTIVE' | 'INACTIVE';
}

export const ValidateurEmailSchema =
  SchemaFactory.createForClass(ValidateurEmail);
