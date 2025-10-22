import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      "apiName": "UCB-CONNECT-API",
      "description": "API pour les logiciels de gestion d'entreprise UCB (Union Camerounaise de Brasseries), développée avec NestJS.",
      "version": "1.0.0",
      "basePath": "/api/v1",
      "company": {
        "name": "UCB (Union Camerounaise de Brasseries)",
        "location": "Cameroun"
      },
      "technologies": {
        "framework": "NestJS",
        "language": "TypeScript",
        "database": "...",
        "orm": "...",   
        "authentication": "JWT (JSON Web Tokens)"  
      },
      "modules": [
        {    
          "name": "Authentification",
          "endpoints": [
            {
              "path": "/auth/login",
              "method": "POST",
              "description": "Authentification de l'utilisateur et génération d'un token JWT.",
              "requestBody": "email, password",
              "response": "JWT token"
            },
            {
              "path": "/auth/profile",
              "method": "GET",
              "description": "Récupération du profil de l'utilisateur authentifié.",
              "isProtected": true,
              "response": "User object"
            }
          ]
        },
      ],
      "security": {
        "authentication": "JWT (Bearer Token)",
        "authorization": "Role-Based Access Control (RBAC)"
      },
      "documentation": "Swagger (OpenAPI) intégré via @nestjs/swagger",
      "status": "En production / Développement"
    };
  }
}
