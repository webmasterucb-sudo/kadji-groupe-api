import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Users extends Document {

  @Prop({ required: true, trim: true })
  nom: string;

  @Prop({ required: true, trim: true })
  prenom: string;

  @Prop({ required: true })
  sexe: string;

  @Prop({ required: true, unique: true, trim: true })
  phone: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: false }) // Message est souvent optionnel
  message: string;

  @Prop({ default: 0 })
  nbrScan: number;

  @Prop() // URL vers l'image de profil
  profilUser: string;

  @Prop({ required: true })
  codeAcces: string; // Vous devriez hasher ce code avant de le sauvegarder

  @Prop({ default: 'actif' }) // Valeurs possibles: 'actif', 'bloqué', 'inactif'
  statutCompte: string;

  @Prop({ default: Date.now() })
  lastConnectedDate: Date;

}
export const UsersSchema = SchemaFactory.createForClass(Users);


  
