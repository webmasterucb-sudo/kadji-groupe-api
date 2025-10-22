import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class BienImmo extends Document {
  @Prop({ type: String, required: false })
  photoLink?: string;

  @Prop({ type: String, required: false })
  designation: string;

  @Prop({ type: String, required: false })
  reference?: string;

  @Prop({ type: String, required: false })
  numeroSerie?: string;

  @Prop({ type: String, required: false })
  fournisseur?: string;

  @Prop({ type: Date, required: true })
  dateAcquisition: Date;

  @Prop({ type: String, required: true, unique: true, index: true })
  codeSAP: string;

  @Prop({ type: String, required: true, unique: true, index: true })
  numeroInventaire: string;

  @Prop({ type: Date, required: false })
  dateDernierInventaire?: Date;

  @Prop({ type: String, required: false })
  serviceAffectation: string;

  @Prop({ type: String, required: false })
  siteAffectation: string;

  @Prop({ type: String, required: false })
  responsable: string;

  @Prop({ type: String, required: false })
  emplacement1: string;

  @Prop({ type: String, required: false })
  emplacement2?: string;

  @Prop({ type: String, required: false })
  utilisateur?: string;

  @Prop({ type: Number, required: true })
  valeurAcquisition: number;

  @Prop({ type: String, default: "a_definir" })
  etatImmo: string;

  @Prop({ type: String, required: true })
  compteBilan: string;

  @Prop({ type: Number, required: true })
  valeureOrigine: number;

  @Prop({ type: Number, required: false })
  valeurResiduelle: number;

  @Prop({ type: Number, required: false })
  dureeVie: number;

  @Prop({ type: Date, required: false })
  dateFinAmortissement: Date;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({ type: String, required: false })
  observation?: string;

  @Prop({ type: String, required: false })
  libelleCompte: string;

  @Prop({ type: Number, required: false })
  geoPositionDX?: number;

  @Prop({ type: Number, required: false })
  geoPositionDY?: number;

  @Prop({ type: String, required: false })
  codeEmplacement?: string;

  @Prop({ type: Boolean, default: false })
  isImmoScan?: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Users', required: false, index: true })
  collecteurImmoID?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Users', required: false, index: true })
  controleurImmoID?: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: false })
  statutImmo?: string;

  @Prop({ type: Boolean, default: false })
  isImmoControle?: boolean;

  @Prop({ type: String, required: false })
  localisationImmoRef?: string;

  @Prop({ type: Number, required: true, index: true })
  creationIndexe: number;

  @Prop({ type: Date, required: false })
  dateScan?: Date;

  @Prop({ type: Date, required: false })
  dateControle?: Date;

}

export const BienImmoSchema = SchemaFactory.createForClass(BienImmo);
 
// Ajout d'un index composé pour les champs fréquemment utilisés ensemble
