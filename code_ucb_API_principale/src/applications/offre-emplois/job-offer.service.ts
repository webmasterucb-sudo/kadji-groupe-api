import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  ConflictException,
  InternalServerErrorException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { JobOffer, JobOfferDocument } from './schemas/job-offer.schema';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { JobOfferQueryDto, PaginatedResponse } from './dto/job-offer-query.dto';

/**
 * Service pour la gestion des offres d'emploi
 */
@Injectable()
export class JobOfferService {
  constructor(
    @InjectModel(JobOffer.name) 
    private readonly jobOfferModel: Model<JobOfferDocument>
  ) {}

  /**
   * Créer une nouvelle offre d'emploi
   * @param createJobOfferDto - Données de l'offre à créer
   * @returns L'offre d'emploi créée
   */
  async create(createJobOfferDto: CreateJobOfferDto): Promise<JobOfferDocument> {
    try {
      // Validation de la date limite de candidature
      if (createJobOfferDto.applicationDeadline) {
        const deadline = new Date(createJobOfferDto.applicationDeadline);
        if (deadline <= new Date()) {
          throw new BadRequestException('La date limite de candidature doit être dans le futur');
        }
      }   

      // Validation du salaire
      if (createJobOfferDto.salary) {
        if (createJobOfferDto.salary.min >= createJobOfferDto.salary.max) {
          throw new BadRequestException('Le salaire minimum doit être inférieur au salaire maximum');
        }
      }

      const jobOffer = new this.jobOfferModel({
        ...createJobOfferDto,
        applicationDeadline: createJobOfferDto.applicationDeadline 
          ? new Date(createJobOfferDto.applicationDeadline) 
          : undefined
      });

      return await jobOffer.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(`Erreur de validation: ${error.message}`);
      }
      if (error.code === 11000) {
        throw new ConflictException('Une offre d\'emploi similaire existe déjà');
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la création de l\'offre d\'emploi');
    }
  }

  /**  
   * Récupérer toutes les offres d'emploi avec pagination et filtres
   * @param queryDto - Paramètres de requête
   * @returns Liste paginée des offres d'emploi
   */
  async findAll(queryDto: JobOfferQueryDto): Promise<PaginatedResponse<JobOfferDocument>> {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = queryDto;
      
      // Construction du filtre MongoDB
      const filter = this.buildFilter(filters);
      
      // Construction du tri
      const sort = this.buildSort(sortBy, sortOrder);
      
      // Calcul de la pagination
      const skip = (page - 1) * limit;
      
      // Exécution des requêtes en parallèle
      const [data, totalItems] = await Promise.all([
        this.jobOfferModel
          .find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .exec(),
        this.jobOfferModel.countDocuments(filter).exec()
      ]);

      // Calcul des métadonnées de pagination
      const totalPages = Math.ceil(totalItems / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        data,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
          hasNextPage,
          hasPreviousPage
        },
        filters: {
          contractType: filters.contractType,
          experience: filters.experience,
          location: filters.location,
          company: filters.company,
          isActive: filters.isActive,
          minSalary: filters.minSalary,
          maxSalary: filters.maxSalary,
          skills: filters.skills,
          searchQuery: filters.q
        },
        sorting: {
          sortBy,
          sortOrder
        }
      };
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la récupération des offres d\'emploi');
    }
  }

  /**
   * Récupérer une offre d'emploi par son ID
   * @param id - ID de l'offre d'emploi
   * @returns L'offre d'emploi trouvée
   */
  async findOne(id: string): Promise<JobOfferDocument> {
    try {
      const jobOffer = await this.jobOfferModel.findById(id).exec();
      
      if (!jobOffer) {
        throw new NotFoundException(`Offre d'emploi avec l'ID ${id} non trouvée`);
      }
      
      return jobOffer;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.name === 'CastError') {
        throw new BadRequestException('ID d\'offre d\'emploi invalide');
      }
      throw new InternalServerErrorException('Erreur lors de la récupération de l\'offre d\'emploi');
    }
  }

  /**
   * Mettre à jour une offre d'emploi
   * @param id - ID de l'offre d'emploi
   * @param updateJobOfferDto - Données de mise à jour
   * @returns L'offre d'emploi mise à jour
   */
  async update(id: string, updateJobOfferDto: UpdateJobOfferDto): Promise<JobOfferDocument> {
    try {
      // Validation de la date limite de candidature
      if (updateJobOfferDto.applicationDeadline) {
        const deadline = new Date(updateJobOfferDto.applicationDeadline);
        if (deadline <= new Date()) {
          throw new BadRequestException('La date limite de candidature doit être dans le futur');
        }
      }

      // Validation du salaire
      if (updateJobOfferDto.salary) {
        if (updateJobOfferDto.salary.min && updateJobOfferDto.salary.max) {
          if (updateJobOfferDto.salary.min >= updateJobOfferDto.salary.max) {
            throw new BadRequestException('Le salaire minimum doit être inférieur au salaire maximum');
          }
        }
      }

      const updateData = {
        ...updateJobOfferDto,
        applicationDeadline: updateJobOfferDto.applicationDeadline 
          ? new Date(updateJobOfferDto.applicationDeadline) 
          : undefined
      };

      const jobOffer = await this.jobOfferModel
        .findByIdAndUpdate(id, updateData, { 
          new: true, 
          runValidators: true 
        })
        .exec();

      if (!jobOffer) {
        throw new NotFoundException(`Offre d'emploi avec l'ID ${id} non trouvée`);
      }

      return jobOffer;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      if (error.name === 'ValidationError') {
        throw new BadRequestException(`Erreur de validation: ${error.message}`);
      }
      if (error.name === 'CastError') {
        throw new BadRequestException('ID d\'offre d\'emploi invalide');
      }
      throw new InternalServerErrorException('Erreur lors de la mise à jour de l\'offre d\'emploi');
    }
  }

  /**
   * Supprimer une offre d'emploi
   * @param id - ID de l'offre d'emploi
   * @returns Message de confirmation
   */
  async remove(id: string): Promise<{ message: string }> {
    try {
      const jobOffer = await this.jobOfferModel.findByIdAndDelete(id).exec();
      
      if (!jobOffer) {
        throw new NotFoundException(`Offre d'emploi avec l'ID ${id} non trouvée`);
      }
      
      return { message: `Offre d'emploi "${jobOffer.title}" supprimée avec succès` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.name === 'CastError') {
        throw new BadRequestException('ID d\'offre d\'emploi invalide');
      }
      throw new InternalServerErrorException('Erreur lors de la suppression de l\'offre d\'emploi');
    }
  }

  /**
   * Rechercher des offres d'emploi par mots-clés
   * @param query - Terme de recherche
   * @param queryDto - Paramètres de requête additionnels
   * @returns Liste paginée des offres d'emploi correspondantes
   */
  async search(query: string, queryDto: JobOfferQueryDto): Promise<PaginatedResponse<JobOfferDocument>> {
    try {
      const searchQuery = { ...queryDto, q: query };
      return await this.findAll(searchQuery);
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la recherche d\'offres d\'emploi');
    }
  }

  /**
   * Activer/Désactiver une offre d'emploi
   * @param id - ID de l'offre d'emploi
   * @param isActive - Nouveau statut
   * @returns L'offre d'emploi mise à jour
   */
  async toggleActive(id: string, isActive: boolean): Promise<JobOfferDocument> {
    try {
      const jobOffer = await this.jobOfferModel
        .findByIdAndUpdate(id, { isActive }, { new: true })
        .exec();

      if (!jobOffer) {
        throw new NotFoundException(`Offre d'emploi avec l'ID ${id} non trouvée`);
      }

      return jobOffer;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.name === 'CastError') {
        throw new BadRequestException('ID d\'offre d\'emploi invalide');
      }
      throw new InternalServerErrorException('Erreur lors de la mise à jour du statut de l\'offre d\'emploi');
    }
  }

  /**
   * Incrémenter le nombre de postulants pour une offre d'emploi
   * @param id - ID de l'offre d'emploi
   * @returns L'offre d'emploi mise à jour
   */
  async incrementPostuleNumber(id: string): Promise<JobOfferDocument> {
    try {
      const jobOffer = await this.jobOfferModel
        .findByIdAndUpdate(
          id, 
          { $inc: { totalPostuleNumber: 1 } }, 
          { new: true }
        )
        .exec();

      if (!jobOffer) {
        throw new NotFoundException(`Offre d'emploi avec l'ID ${id} non trouvée`);
      }

      return jobOffer;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.name === 'CastError') {
        throw new BadRequestException('ID d\'offre d\'emploi invalide');
      }
      throw new InternalServerErrorException('Erreur lors de l\'incrémentation du nombre de postulants');
    }
  }

  /**
   * Mettre à jour le nombre de postulants pour une offre d'emploi
   * @param id - ID de l'offre d'emploi
   * @param totalPostuleNumber - Nouveau nombre de postulants
   * @returns L'offre d'emploi mise à jour
   */
  async updatePostuleNumber(id: string, totalPostuleNumber: number): Promise<JobOfferDocument> {
    try {
      if (totalPostuleNumber < 0) {
        throw new BadRequestException('Le nombre de postulants ne peut pas être négatif');
      }

      const jobOffer = await this.jobOfferModel
        .findByIdAndUpdate(
          id, 
          { totalPostuleNumber }, 
          { new: true }
        )
        .exec();

      if (!jobOffer) {
        throw new NotFoundException(`Offre d'emploi avec l'ID ${id} non trouvée`);
      }

      return jobOffer;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      if (error.name === 'CastError') {
        throw new BadRequestException('ID d\'offre d\'emploi invalide');
      }
      throw new InternalServerErrorException('Erreur lors de la mise à jour du nombre de postulants');
    }
  }

  /**
   * Construire le filtre MongoDB à partir des paramètres de requête
   * @param filters - Filtres de requête
   * @returns Filtre MongoDB
   */
  private buildFilter(filters: Partial<JobOfferQueryDto>): FilterQuery<JobOfferDocument> {
    const filter: FilterQuery<JobOfferDocument> = {};

    // Recherche textuelle
    if (filters.q) {
      filter.$text = { $search: filters.q };
    }

    // Filtres exacts
    if (filters.contractType) {
      filter.contractType = filters.contractType;
    }

    if (filters.experience) {
      filter.experience = filters.experience;
    }

    if (filters.location) {
      filter.location = { $regex: filters.location, $options: 'i' };
    }

    if (filters.company) {
      filter.company = { $regex: filters.company, $options: 'i' };
    }

    if (typeof filters.isActive === 'boolean') {
      filter.isActive = filters.isActive;
    }

    // Filtres de salaire
    if (filters.minSalary || filters.maxSalary) {
      filter['salary.min'] = {};
      if (filters.minSalary) {
        filter['salary.min'].$gte = filters.minSalary;
      }
      if (filters.maxSalary) {
        filter['salary.max'] = { $lte: filters.maxSalary };
      }
    }

    // Filtre par compétences
    if (filters.skills) {
      filter.skills = { $in: [new RegExp(filters.skills, 'i')] };
    }

    return filter;
  }

  /**
   * Construire l'objet de tri MongoDB
   * @param sortBy - Champ de tri
   * @param sortOrder - Ordre de tri
   * @returns Objet de tri MongoDB
   */
  private buildSort(sortBy: string, sortOrder: 'asc' | 'desc'): Record<string, any> {
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    
    // Gestion du tri par score de recherche textuelle
    if (sortBy === 'relevance') {
      return { score: { $meta: 'textScore' } };
    }
    
    return { [sortBy]: sortDirection };
  }
}
