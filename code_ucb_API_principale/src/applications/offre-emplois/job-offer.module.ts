import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobOfferController } from './job-offer.controller';
import { JobOfferService } from './job-offer.service';
import { JobOffer, JobOfferSchema } from './schemas/job-offer.schema';

/**
 * Module pour la gestion des offres d'emploi
 * 
 * Ce module encapsule toute la logique liée aux offres d'emploi :
 * - Contrôleur pour les endpoints REST
 * - Service pour la logique métier
 * - Schéma Mongoose pour la base de données
 * - DTOs pour la validation des données
 */
@Module({
  imports: [
    // Configuration du schéma Mongoose pour les offres d'emploi
    MongooseModule.forFeature([
      { 
        name: JobOffer.name, 
        schema: JobOfferSchema 
      }
    ])
  ],
  controllers: [JobOfferController],
  providers: [JobOfferService],
  exports: [
    JobOfferService, // Exporte le service pour utilisation dans d'autres modules
    MongooseModule // Exporte le modèle Mongoose si nécessaire
  ]
})
export class JobOfferModule {}

/**
 * Structure du module :
 * 
 * JobOfferModule
 * ├── Imports
 * │   └── MongooseModule.forFeature() - Configuration du schéma MongoDB
 * ├── Controllers
 * │   └── JobOfferController - Gestion des endpoints REST
 * ├── Providers
 * │   └── JobOfferService - Logique métier et accès aux données
 * └── Exports
 *     ├── JobOfferService - Pour utilisation dans d'autres modules
 *     └── MongooseModule - Pour accès au modèle dans d'autres modules
 * 
 * Fonctionnalités fournies :
 * - CRUD complet pour les offres d'emploi
 * - Recherche textuelle avancée
 * - Pagination et filtres
 * - Validation des données
 * - Gestion d'erreurs appropriée
 * - Index MongoDB optimisés
 */
