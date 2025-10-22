import { 
  IsOptional, 
  IsString, 
  IsEnum, 
  IsNumber, 
  Min, 
  Max,
  IsBoolean
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ContractType, ExperienceLevel } from '../interfaces/job-offer.interface';

/**
 * DTO pour les paramètres de requête et filtres des offres d'emploi
 */
export class JobOfferQueryDto {
  // Pagination
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La page doit être un nombre' })
  @Min(1, { message: 'La page doit être supérieure à 0' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La limite doit être un nombre' })
  @Min(1, { message: 'La limite doit être supérieure à 0' })
  @Max(100, { message: 'La limite ne peut pas dépasser 100' })
  limit?: number = 10;

  // Recherche textuelle
  @IsOptional()
  @IsString({ message: 'Le terme de recherche doit être une chaîne de caractères' })
  @Transform(({ value }) => value?.trim())
  q?: string;

  // Filtres
  @IsOptional()
  @IsEnum(['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance'], {
    message: 'Le type de contrat doit être: CDI, CDD, Stage, Freelance ou Alternance'
  })
  contractType?: ContractType;

  @IsOptional()
  @IsEnum(['Junior', 'Confirmé', 'Senior', 'Expert'], {
    message: 'Le niveau d\'expérience doit être: Junior, Confirmé, Senior ou Expert'
  })
  experience?: ExperienceLevel;

  @IsOptional()
  @IsString({ message: 'La localisation doit être une chaîne de caractères' })
  @Transform(({ value }) => value?.trim())
  location?: string;

  @IsOptional()
  @IsString({ message: 'Le nom de l\'entreprise doit être une chaîne de caractères' })
  @Transform(({ value }) => value?.trim())
  company?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'Le statut actif doit être un booléen' })
  isActive?: boolean;

  // Filtres de salaire
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Le salaire minimum doit être un nombre' })
  @Min(0, { message: 'Le salaire minimum doit être positif' })
  minSalary?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Le salaire maximum doit être un nombre' })
  @Min(0, { message: 'Le salaire maximum doit être positif' })
  maxSalary?: number;

  // Tri
  @IsOptional()
  @IsEnum(['createdAt', 'updatedAt', 'title', 'company', 'applicationDeadline', 'salary.min'], {
    message: 'Le champ de tri doit être: createdAt, updatedAt, title, company, applicationDeadline ou salary.min'
  })
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'], {
    message: 'L\'ordre de tri doit être: asc ou desc'
  })
  sortOrder?: 'asc' | 'desc' = 'desc';

  // Filtres par compétences (recherche dans le tableau)
  @IsOptional()
  @IsString({ message: 'Les compétences doivent être une chaîne de caractères' })
  @Transform(({ value }) => value?.trim())
  skills?: string;
}

/**
 * Interface pour la réponse paginée
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters?: {
    contractType?: ContractType;
    experience?: ExperienceLevel;
    location?: string;
    company?: string;
    isActive?: boolean;
    minSalary?: number;
    maxSalary?: number;
    skills?: string;
    searchQuery?: string;
  };
  sorting?: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}
