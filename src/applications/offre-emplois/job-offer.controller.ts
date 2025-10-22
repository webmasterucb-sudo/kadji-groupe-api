import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  ParseBoolPipe
} from '@nestjs/common';
import { JobOfferService } from './job-offer.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { JobOfferQueryDto, PaginatedResponse } from './dto/job-offer-query.dto';
import { JobOfferDocument } from './schemas/job-offer.schema';

/**
 * Contrôleur pour la gestion des offres d'emploi
 * Gère tous les endpoints CRUD et de recherche
 */
@Controller('job-offers')
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true
}))
export class JobOfferController {
  constructor(private readonly jobOfferService: JobOfferService) { }

  /**
   * POST /job-offers
   * Créer une nouvelle offre d'emploi
   * 
   * @example
   * POST /job-offers
   * {
   *   "title": "Développeur Full Stack",
   *   "description": "Nous recherchons un développeur expérimenté...",
   *   "company": "TechCorp",
   *   "location": "Paris",
   *   "contractType": "CDI",
   *   "experience": "Confirmé",
   *   "skills": ["JavaScript", "React", "Node.js"],
   *   "requirements": ["Bac+5", "3 ans d'expérience"],
   *   "salary": {
   *     "min": 45000,
   *     "max": 55000,
   *     "currency": "EUR"
   *   }
   * }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createJobOfferDto: CreateJobOfferDto): Promise<JobOfferDocument> {
    return await this.jobOfferService.create(createJobOfferDto);
  }

  /**
   * GET /job-offers
   * Récupérer toutes les offres d'emploi avec pagination et filtres
   * 
   * @example
   * GET /job-offers?page=1&limit=10&contractType=CDI&experience=Senior&location=Paris
   * GET /job-offers?q=javascript&sortBy=createdAt&sortOrder=desc
   * GET /job-offers?minSalary=40000&maxSalary=60000&isActive=true
   */
  @Get()
  async findAll(@Query() queryDto: JobOfferQueryDto): Promise<PaginatedResponse<JobOfferDocument>> {
    return await this.jobOfferService.findAll(queryDto);
  }

  /**
   * GET /job-offers/search
   * Rechercher des offres d'emploi par mots-clés
   * 
   * @example
   * GET /job-offers/search?q=javascript&page=1&limit=5
   * GET /job-offers/search?q=développeur&contractType=CDI&experience=Senior
   */
  @Get('search')
  async search(
    @Query('q') query: string,
    @Query() queryDto: JobOfferQueryDto
  ): Promise<PaginatedResponse<JobOfferDocument>> {
    return await this.jobOfferService.search(query, queryDto);
  }

  /**
   * GET /job-offers/:id
   * Récupérer une offre d'emploi spécifique par son ID
   * 
   * @example
   * GET /job-offers/507f1f77bcf86cd799439011
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<JobOfferDocument> {
    return await this.jobOfferService.findOne(id);
  }

  /**
   * PUT /job-offers/:id
   * Mettre à jour complètement une offre d'emploi
   * 
   * @example
   * PUT /job-offers/507f1f77bcf86cd799439011
   * {
   *   "title": "Senior Full Stack Developer",
   *   "description": "Description mise à jour...",
   *   "company": "TechCorp",
   *   "location": "Lyon",
   *   "contractType": "CDI",
   *   "experience": "Senior",
   *   "skills": ["JavaScript", "React", "Node.js", "TypeScript"],
   *   "requirements": ["Bac+5", "5 ans d'expérience"]
   * }
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateJobOfferDto: UpdateJobOfferDto
  ): Promise<JobOfferDocument> {
    return await this.jobOfferService.update(id, updateJobOfferDto);
  }

  /**
   * PATCH /job-offers/:id
   * Modification partielle d'une offre d'emploi
   * 
   * @example
   * PATCH /job-offers/507f1f77bcf86cd799439011
   * {
   *   "salary": {
   *     "min": 50000,
   *     "max": 65000,
   *     "currency": "EUR"
   *   },
   *   "isActive": false
   * }
   */
  @Patch(':id')
  async partialUpdate(
    @Param('id') id: string,
    @Body() updateJobOfferDto: UpdateJobOfferDto
  ): Promise<JobOfferDocument> {
    return await this.jobOfferService.update(id, updateJobOfferDto);
  }

  /**
   * PATCH /job-offers/:id/toggle-active
   * Activer/Désactiver une offre d'emploi
   * 
   * @example
   * PATCH /job-offers/507f1f77bcf86cd799439011/toggle-active?isActive=false
   */
  @Patch(':id/toggle-active')
  async toggleActive(
    @Param('id') id: string,
    @Query('isActive', ParseBoolPipe) isActive: boolean
  ): Promise<JobOfferDocument> {
    return await this.jobOfferService.toggleActive(id, isActive);
  }

  /**
   * DELETE /job-offers/:id
   * Supprimer une offre d'emploi
   * 
   * @example
   * DELETE /job-offers/507f1f77bcf86cd799439011
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return await this.jobOfferService.remove(id);
  }

  /**
   * PATCH /job-offers/:id/increment-postule
   * Incrémenter le nombre de postulants pour une offre d'emploi
   * 
   * @example
   * PATCH /job-offers/507f1f77bcf86cd799439011/increment-postule
   */
  @Patch(':id/increment-postule')
  async incrementPostuleNumber(@Param('id') id: string): Promise<JobOfferDocument> {
    return await this.jobOfferService.incrementPostuleNumber(id);
  }

  /**
   * PATCH /job-offers/:id/update-postule
   * Mettre à jour le nombre de postulants pour une offre d'emploi
   * 
   * @example
   * PATCH /job-offers/507f1f77bcf86cd799439011/update-postule?totalPostuleNumber=25
   */
  @Patch(':id/update-postule')
  async updatePostuleNumber(
    @Param('id') id: string,
    @Query('totalPostuleNumber') totalPostuleNumber: number
  ): Promise<JobOfferDocument> {
    return await this.jobOfferService.updatePostuleNumber(id, Number(totalPostuleNumber));
  }
}

/**
 * Exemples de réponses JSON pour chaque endpoint :
 * 
 * 1. POST /job-offers (Création)
 * Response 201:
 * {
 *   "_id": "507f1f77bcf86cd799439011",
 *   "title": "Développeur Full Stack",
 *   "description": "Nous recherchons un développeur expérimenté...",
 *   "company": "TechCorp",
 *   "location": "Paris",
 *   "salary": {
 *     "min": 45000,
 *     "max": 55000,
 *     "currency": "EUR"
 *   },
 *   "contractType": "CDI",
 *   "experience": "Confirmé",
 *   "skills": ["JavaScript", "React", "Node.js"],
 *   "benefits": [],
 *   "requirements": ["Bac+5", "3 ans d'expérience"],
 *   "applicationDeadline": null,
 *   "isActive": true,
 *   "createdAt": "2024-01-15T10:30:00.000Z",
 *   "updatedAt": "2024-01-15T10:30:00.000Z"
 * }
 * 
 * 2. GET /job-offers (Liste avec pagination)
 * Response 200:
 * {
 *   "data": [
 *     {
 *       "_id": "507f1f77bcf86cd799439011",
 *       "title": "Développeur Full Stack",
 *       "company": "TechCorp",
 *       "location": "Paris",
 *       "contractType": "CDI",
 *       "experience": "Confirmé",
 *       "isActive": true,
 *       "createdAt": "2024-01-15T10:30:00.000Z"
 *     }
 *   ],
 *   "pagination": {
 *     "currentPage": 1,
 *     "totalPages": 5,
 *     "totalItems": 47,
 *     "itemsPerPage": 10,
 *     "hasNextPage": true,
 *     "hasPreviousPage": false
 *   },
 *   "filters": {
 *     "contractType": "CDI",
 *     "experience": null,
 *     "location": null,
 *     "company": null,
 *     "isActive": true
 *   },
 *   "sorting": {
 *     "sortBy": "createdAt",
 *     "sortOrder": "desc"
 *   }
 * }
 * 
 * 3. GET /job-offers/:id (Détail)
 * Response 200: (même structure que la création)
 * 
 * 4. PUT/PATCH /job-offers/:id (Mise à jour)
 * Response 200: (même structure que la création avec les modifications)
 * 
 * 5. DELETE /job-offers/:id (Suppression)
 * Response 200:
 * {
 *   "message": "Offre d'emploi \"Développeur Full Stack\" supprimée avec succès"
 * }
 * 
 * 6. GET /job-offers/search?q=javascript (Recherche)
 * Response 200: (même structure que GET /job-offers avec résultats filtrés)
 * 
 * Codes d'erreur possibles :
 * - 400 Bad Request : Données invalides, ID malformé
 * - 404 Not Found : Offre d'emploi non trouvée
 * - 409 Conflict : Offre d'emploi en doublon
 * - 500 Internal Server Error : Erreur serveur
 */
