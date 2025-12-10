import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'users_parametres' })
export class AdminUser extends Document {
  @Prop({ required: true, maxlength: 100 })
  nom: string;

  @Prop({ required: true, maxlength: 100 })
  prenom: string;

  @Prop({ required: true, maxlength: 20 })
  telephone: string;

  @Prop({ required: true, unique: true, maxlength: 255 })
  email: string;

  @Prop({ required: true, maxlength: 255 })
  password: string;

  @Prop({ required: true, maxlength: 50 })
  role: string;

  @Prop({
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE',
  })
  status: 'ACTIVE' | 'INACTIVE';

  createdAt?: Date;
  updatedAt?: Date;
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);
