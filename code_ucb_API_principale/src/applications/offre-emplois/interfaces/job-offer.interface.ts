import { Document } from 'mongoose';

/**
 * Interface pour les informations de salaire
 */
export interface SalaryInfo {
  min: number;
  max: number;
  currency: string;
}

/**
 * Types de contrat disponibles
 */
export type ContractType = 'CDI' | 'CDD' | 'Stage' | 'Freelance' | 'Alternance';

/**
 * Niveaux d'expérience
 */
export type ExperienceLevel = 'Junior' | 'Confirmé' | 'Senior' | 'Expert';

/**
 * Interface principale pour une offre d'emploi
 */
export interface JobOffer {
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: SalaryInfo;
  contractType: ContractType;
  experience: ExperienceLevel;
  skills: string[];
  benefits?: string[];
  requirements: string[];
  applicationDeadline?: Date;
  isActive: boolean;
  totalPostuleNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface pour le document MongoDB (avec les méthodes Mongoose)
 */
export interface JobOfferDocument extends JobOffer, Document {}
