import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ContractType, ExperienceLevel, SalaryInfo } from '../interfaces/job-offer.interface';

/**
 * Schéma pour les informations de salaire
 */
@Schema({ _id: false })
export class Salary implements SalaryInfo {
  @Prop({ required: true, min: 0 })
  min: number;

  @Prop({ required: true, min: 0 })
  max: number;

  @Prop({ required: true, default: 'EUR' })
  currency: string;
}

const SalarySchema = SchemaFactory.createForClass(Salary);

/**
 * Schéma principal pour une offre d'emploi
 */
@Schema({
  timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  collection: 'job-offers'
})
export class JobOffer {
  @Prop({ 
    required: true, 
    trim: true,
    maxlength: 200,
    index: true // Index pour améliorer les performances de recherche
  })
  title: string;

  @Prop({ 
    required: true, 
    trim: true,
    maxlength: 5000
  })
  description: string;

  @Prop({ 
    required: true, 
    trim: true,
    maxlength: 100,
    index: true
  })
  company: string;

  @Prop({ 
    required: true, 
    trim: true,
    maxlength: 100,
    index: true
  })
  location: string;

  @Prop({ 
    type: SalarySchema, 
    required: false 
  })
  salary?: Salary;

  @Prop({ 
    required: true,
    enum: ['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance'],
    index: true
  })
  contractType: ContractType;

  @Prop({ 
    required: true,
    enum: ['Junior', 'Confirmé', 'Senior', 'Expert'],
    index: true
  })
  experience: ExperienceLevel;

  @Prop({ 
    type: [String], 
    required: true,
    validate: {
      validator: function(skills: string[]) {
        return skills && skills.length > 0;
      },
      message: 'Au moins une compétence est requise'
    }
  })
  skills: string[];

  @Prop({ 
    type: [String], 
    required: false 
  })
  benefits?: string[];

  @Prop({ 
    type: [String], 
    required: true,
    validate: {
      validator: function(requirements: string[]) {
        return requirements && requirements.length > 0;
      },
      message: 'Au moins une exigence est requise'
    }
  })
  requirements: string[];

  @Prop({ 
    type: Date, 
    required: false,
    validate: {
      validator: function(date: Date) {
        return !date || date > new Date();
      },
      message: 'La date limite de candidature doit être dans le futur'
    }
  })
  applicationDeadline?: Date;

  @Prop({ 
    required: true, 
    default: true,
    index: true
  })
  isActive: boolean;

  @Prop({ 
    required: true, 
    default: 0,
    min: 0
  })
  totalPostuleNumber: number;

  // Les champs createdAt et updatedAt sont automatiquement ajoutés par timestamps: true
  createdAt: Date;
  updatedAt: Date;
}

export type JobOfferDocument = JobOffer & Document;
export const JobOfferSchema = SchemaFactory.createForClass(JobOffer);

// Index composé pour améliorer les performances des requêtes de recherche
JobOfferSchema.index({ 
  title: 'text', 
  description: 'text', 
  skills: 'text',
  company: 'text'
}, {
  weights: {
    title: 10,
    skills: 5,
    company: 3,
    description: 1
  },
  name: 'job_offer_text_index'
});

// Index pour les filtres courants
JobOfferSchema.index({ contractType: 1, experience: 1, isActive: 1 });
JobOfferSchema.index({ location: 1, isActive: 1 });
JobOfferSchema.index({ createdAt: -1 });
