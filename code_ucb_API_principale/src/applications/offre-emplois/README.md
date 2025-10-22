# Module de Gestion des Offres d'Emploi

Ce module fournit une API REST complète pour la gestion des offres d'emploi avec NestJS et MongoDB.

## 🚀 Fonctionnalités

- ✅ CRUD complet (Create, Read, Update, Delete)
- ✅ Recherche textuelle avancée avec MongoDB Text Search
- ✅ Pagination efficace
- ✅ Filtres multiples (type de contrat, expérience, localisation, etc.)
- ✅ Validation des données avec class-validator
- ✅ Gestion d'erreurs appropriée
- ✅ Index MongoDB optimisés
- ✅ Messages d'erreur en français

## 📁 Structure des fichiers

```
src/applications/offre-emplois/
├── dto/
│   ├── create-job-offer.dto.ts     # DTO pour la création
│   ├── update-job-offer.dto.ts     # DTO pour la mise à jour
│   └── job-offer-query.dto.ts      # DTO pour les requêtes/filtres
├── interfaces/
│   └── job-offer.interface.ts      # Interfaces TypeScript
├── schemas/
│   └── job-offer.schema.ts         # Schéma Mongoose
├── job-offer.controller.ts         # Contrôleur REST
├── job-offer.service.ts            # Service avec logique métier
├── job-offer.module.ts             # Module NestJS
└── README.md                       # Cette documentation
```

## 🛠 Installation et Configuration

### 1. Dépendances requises

Les dépendances suivantes sont déjà installées :
- `@nestjs/mongoose`
- `mongoose`
- `class-validator`
- `class-transformer`

### 2. Configuration MongoDB

Assurez-vous que votre fichier `.env` contient :
```env
MONGODB_URI_DEV=mongodb://localhost:27017/ucb-connect
```

### 3. Démarrage de l'application

```bash
npm run start:dev
```

## 📚 API Endpoints

### Base URL
```
http://localhost:3000/job-offers
```

### 1. Créer une offre d'emploi
```http
POST /job-offers
Content-Type: application/json

{
  "title": "Développeur Full Stack Senior",
  "description": "Nous recherchons un développeur expérimenté pour rejoindre notre équipe dynamique. Vous travaillerez sur des projets innovants utilisant les dernières technologies web.",
  "company": "TechCorp Solutions",
  "location": "Paris, France",
  "contractType": "CDI",
  "experience": "Senior",
  "skills": ["JavaScript", "TypeScript", "React", "Node.js", "MongoDB"],
  "requirements": [
    "Bac+5 en informatique ou équivalent",
    "5+ ans d'expérience en développement web",
    "Maîtrise de JavaScript/TypeScript",
    "Expérience avec React et Node.js"
  ],
  "benefits": [
    "Télétravail partiel",
    "Tickets restaurant",
    "Mutuelle d'entreprise",
    "Formation continue"
  ],
  "salary": {
    "min": 55000,
    "max": 70000,
    "currency": "EUR"
  },
  "applicationDeadline": "2024-03-15T23:59:59.000Z"
}
```

### 2. Récupérer toutes les offres (avec pagination)
```http
GET /job-offers?page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

### 3. Filtrer les offres
```http
GET /job-offers?contractType=CDI&experience=Senior&location=Paris&isActive=true
```

### 4. Recherche textuelle
```http
GET /job-offers/search?q=javascript react&page=1&limit=5
```

### 5. Récupérer une offre spécifique
```http
GET /job-offers/507f1f77bcf86cd799439011
```

### 6. Mettre à jour une offre (complète)
```http
PUT /job-offers/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "title": "Lead Developer Full Stack",
  "description": "Description mise à jour...",
  "salary": {
    "min": 60000,
    "max": 75000,
    "currency": "EUR"
  }
}
```

### 7. Mise à jour partielle
```http
PATCH /job-offers/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "isActive": false,
  "applicationDeadline": "2024-04-01T23:59:59.000Z"
}
```

### 8. Activer/Désactiver une offre
```http
PATCH /job-offers/507f1f77bcf86cd799439011/toggle-active?isActive=false
```

### 9. Supprimer une offre
```http
DELETE /job-offers/507f1f77bcf86cd799439011
```

### 10. Incrémenter le nombre de postulants
```http
PATCH /job-offers/507f1f77bcf86cd799439011/increment-postule
```

### 11. Mettre à jour le nombre de postulants
```http
PATCH /job-offers/507f1f77bcf86cd799439011/update-postule?totalPostuleNumber=25
```

## 🔍 Paramètres de recherche et filtres

| Paramètre | Type | Description | Exemple |
|-----------|------|-------------|---------|
| `page` | number | Numéro de page (défaut: 1) | `?page=2` |
| `limit` | number | Nombre d'éléments par page (défaut: 10, max: 100) | `?limit=20` |
| `q` | string | Recherche textuelle | `?q=javascript` |
| `contractType` | enum | Type de contrat | `?contractType=CDI` |
| `experience` | enum | Niveau d'expérience | `?experience=Senior` |
| `location` | string | Localisation (recherche partielle) | `?location=Paris` |
| `company` | string | Entreprise (recherche partielle) | `?company=Tech` |
| `isActive` | boolean | Statut de l'offre | `?isActive=true` |
| `minSalary` | number | Salaire minimum | `?minSalary=40000` |
| `maxSalary` | number | Salaire maximum | `?maxSalary=60000` |
| `skills` | string | Compétences | `?skills=React` |
| `sortBy` | enum | Champ de tri | `?sortBy=createdAt` |
| `sortOrder` | enum | Ordre de tri (asc/desc) | `?sortOrder=desc` |

### Valeurs possibles pour les enums

**contractType:**
- `CDI`
- `CDD`
- `Stage`
- `Freelance`
- `Alternance`

**experience:**
- `Junior`
- `Confirmé`
- `Senior`
- `Expert`

**sortBy:**
- `createdAt`
- `updatedAt`
- `title`
- `company`
- `applicationDeadline`
- `salary.min`

## 📊 Exemples de réponses

### Réponse de création (201)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Développeur Full Stack Senior",
  "description": "Nous recherchons un développeur expérimenté...",
  "company": "TechCorp Solutions",
  "location": "Paris, France",
  "salary": {
    "min": 55000,
    "max": 70000,
    "currency": "EUR"
  },
  "contractType": "CDI",
  "experience": "Senior",
  "skills": ["JavaScript", "TypeScript", "React", "Node.js", "MongoDB"],
  "benefits": ["Télétravail partiel", "Tickets restaurant"],
  "requirements": ["Bac+5 en informatique", "5+ ans d'expérience"],
  "applicationDeadline": "2024-03-15T23:59:59.000Z",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Réponse de liste paginée (200)
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Développeur Full Stack Senior",
      "company": "TechCorp Solutions",
      "location": "Paris, France",
      "contractType": "CDI",
      "experience": "Senior",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 47,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "filters": {
    "contractType": "CDI",
    "experience": "Senior",
    "location": null,
    "company": null,
    "isActive": true,
    "minSalary": null,
    "maxSalary": null,
    "skills": null,
    "searchQuery": null
  },
  "sorting": {
    "sortBy": "createdAt",
    "sortOrder": "desc"
  }
}
```

## ⚠️ Gestion d'erreurs

### Codes d'erreur HTTP

| Code | Description | Exemple |
|------|-------------|---------|
| 400 | Bad Request | Données invalides, ID malformé |
| 404 | Not Found | Offre d'emploi non trouvée |
| 409 | Conflict | Offre d'emploi en doublon |
| 500 | Internal Server Error | Erreur serveur |

### Exemple de réponse d'erreur
```json
{
  "statusCode": 400,
  "message": [
    "Le titre doit contenir au moins 5 caractères",
    "Au moins une compétence est requise"
  ],
  "error": "Bad Request"
}
```

## 🚀 Suggestions d'amélioration

### 1. Authentification et autorisation
```typescript
// Ajouter des guards pour protéger les endpoints
@UseGuards(JwtAuthGuard)
@Post()
async create(@Body() createJobOfferDto: CreateJobOfferDto) {
  // ...
}
```

### 2. Logging et monitoring
```typescript
// Ajouter des logs pour le monitoring
import { Logger } from '@nestjs/common';

@Injectable()
export class JobOfferService {
  private readonly logger = new Logger(JobOfferService.name);

  async create(createJobOfferDto: CreateJobOfferDto) {
    this.logger.log(`Creating job offer: ${createJobOfferDto.title}`);
    // ...
  }
}
```

### 3. Cache Redis
```typescript
// Ajouter du cache pour améliorer les performances
@Injectable()
export class JobOfferService {
  @Cacheable('job-offers', 300) // Cache pendant 5 minutes
  async findAll(queryDto: JobOfferQueryDto) {
    // ...
  }
}
```

### 4. Tests unitaires
```typescript
// Exemple de test pour le service
describe('JobOfferService', () => {
  let service: JobOfferService;
  let model: Model<JobOfferDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobOfferService,
        {
          provide: getModelToken(JobOffer.name),
          useValue: mockJobOfferModel,
        },
      ],
    }).compile();

    service = module.get<JobOfferService>(JobOfferService);
    model = module.get<Model<JobOfferDocument>>(getModelToken(JobOffer.name));
  });

  it('should create a job offer', async () => {
    // Test implementation
  });
});
```

### 5. Documentation Swagger
```typescript
// Ajouter des décorateurs Swagger
@ApiTags('job-offers')
@Controller('job-offers')
export class JobOfferController {
  @ApiOperation({ summary: 'Create a new job offer' })
  @ApiResponse({ status: 201, description: 'Job offer created successfully' })
  @Post()
  async create(@Body() createJobOfferDto: CreateJobOfferDto) {
    // ...
  }
}
```

### 6. Validation avancée
```typescript
// Ajouter des validations personnalisées
@ValidatorConstraint({ name: 'salaryRange', async: false })
export class SalaryRangeConstraint implements ValidatorConstraintInterface {
  validate(salary: CreateSalaryDto) {
    return salary.min < salary.max;
  }

  defaultMessage() {
    return 'Le salaire minimum doit être inférieur au salaire maximum';
  }
}
```

### 7. Événements et notifications
```typescript
// Ajouter des événements pour les notifications
@Injectable()
export class JobOfferService {
  constructor(private eventEmitter: EventEmitter2) {}

  async create(createJobOfferDto: CreateJobOfferDto) {
    const jobOffer = await this.jobOfferModel.save(createJobOfferDto);
    
    // Émettre un événement
    this.eventEmitter.emit('job-offer.created', jobOffer);
    
    return jobOffer;
  }
}
```

## 🔧 Maintenance et optimisation

### Index MongoDB recommandés
Les index suivants sont automatiquement créés par le schéma :
- Index de recherche textuelle sur `title`, `description`, `skills`, `company`
- Index composé sur `contractType`, `experience`, `isActive`
- Index sur `location`, `isActive`
- Index sur `createdAt` (tri par défaut)

### Monitoring des performances
- Surveiller les requêtes lentes avec MongoDB Profiler
- Utiliser des métriques pour suivre l'utilisation des endpoints
- Implémenter des alertes pour les erreurs 500

### Sauvegarde et récupération
- Configurer des sauvegardes automatiques MongoDB
- Tester régulièrement les procédures de récupération
- Documenter les procédures d'urgence

## 📞 Support

Pour toute question ou problème :
1. Vérifiez cette documentation
2. Consultez les logs de l'application
3. Vérifiez la connectivité MongoDB
4. Contactez l'équipe de développement

---

**Version:** 1.0.0  
**Dernière mise à jour:** Janvier 2024  
**Auteur:** Équipe de développement UCB Connect
