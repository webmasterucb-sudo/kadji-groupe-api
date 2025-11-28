import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

export class MembreFamille {
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  prenom: string;

  @Prop({ required: true })
  lien: string; // ex: "conjoint", "enfant", "parent"

  @Prop()
  dateNaissance?: Date;

  @Prop()
  telephone?: string;
}

@Schema({ timestamps: true })
export class Employee {
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  prenom: string;

  @Prop({ required: true, unique: true })
  matricule: string;

  @Prop({ required: true })
  telephone: string;

  @Prop({ required: true, enum: ['Masculin', 'Féminin', 'Autre'] })
  sexe: string;

  @Prop({ required: true })
  entreprise: string;

  @Prop({ required: true })
  fonction: string;

  @Prop({ required: true })
  departement: string;

  @Prop({ required: true, enum: ['Employe', 'Contractuel', 'Consultant', 'Partenaire', "Stagiaire"], default: 'Employe' })
  statut: string;

  @Prop({ type: [MembreFamille], default: [] })
  membreFamille: MembreFamille[];
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);



