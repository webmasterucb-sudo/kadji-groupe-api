/**
 * =============================================================================
 * MODULE PRINCIPAL - MADIBA RUN API
 * =============================================================================
 * 
 * Ce module regroupe toutes les fonctionnalités de l'API Madiba Run:
 * - Gestion des participants (inscription, suivi)
 * - Authentification et gestion des administrateurs
 * - Notifications (SMS, Email)
 * - Upload de fichiers (certificats médicaux)
 * 
 * @author API UCB Connect
 * @version 1.0.0
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { memoryStorage } from 'multer';

// -----------------------------------------------------------------------------
// IMPORTS - PARTICIPANTS
// -----------------------------------------------------------------------------
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { Participant, ParticipantSchema } from './entities/participant.entity';
import { NotificationService } from './services/notification.service';
import { FileUploadService } from './services/file-upload.service';

// -----------------------------------------------------------------------------
// IMPORTS - ADMINISTRATION
// -----------------------------------------------------------------------------
// import { AdminAuthController } from './admin-auth.controller';
import { AdminService } from './services/admin.service';
import { AdminAuthService } from './services/admin-auth.service';
import { Admin, AdminSchema } from './entities/admin.entity';

// -----------------------------------------------------------------------------
// IMPORTS - MODULES EXTERNES
// -----------------------------------------------------------------------------
import { MailModule } from '../../core/mail/mail.module';
import { AdminAuthController } from './admin-auth.controller';

@Module({
  imports: [
    // -------------------------------------------------------------------------
    // CONFIGURATION MONGOOSE - SCHÉMAS MONGODB
    // -------------------------------------------------------------------------
    MongooseModule.forFeature([
      // Collection des participants à l'événement
      { name: Participant.name, schema: ParticipantSchema },
      // Collection des administrateurs de la plateforme
      { name: Admin.name, schema: AdminSchema },
    ]),

    // -------------------------------------------------------------------------
    // CONFIGURATION JWT - AUTHENTIFICATION
    // -------------------------------------------------------------------------
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'secretKey',
        signOptions: { 
          expiresIn: '240h' as const,
        },
      }),
      inject: [ConfigService],
    }),

    // -------------------------------------------------------------------------
    // CONFIGURATION MULTER - UPLOAD DE FICHIERS
    // -------------------------------------------------------------------------
    MulterModule.register({
      storage: memoryStorage(), // Stockage en mémoire avant envoi à l'API externe
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
      fileFilter: (req, file, callback) => {
        // Validation du type de fichier (PDF et images uniquement)
        const allowedMimes = [
          'application/pdf',
          'image/jpeg', 
          'image/jpg',
          'image/png',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new Error('Type de fichier non autorisé. Utilisez PDF, JPEG ou PNG.'),
            false,
          );
        }
      },
    }),
     
    // -------------------------------------------------------------------------
    // CONFIGURATION THROTTLER - RATE LIMITING
    // -------------------------------------------------------------------------
    ThrottlerModule.forRoot([{
      ttl: 60000,   // Fenêtre de 60 secondes
      limit: 3,     // Maximum 3 requêtes par fenêtre
    }]),

    // -------------------------------------------------------------------------
    // MODULE MAIL - NOTIFICATIONS PAR EMAIL (Microsoft Graph)
    // -------------------------------------------------------------------------
    MailModule,
  ],

  // ---------------------------------------------------------------------------
  // CONTRÔLEURS - ROUTES REST API
  // ---------------------------------------------------------------------------
  controllers: [
    ParticipantController,    // Routes participants (/madiba-run/participants)
    AdminAuthController,      // Routes admin (/madiba-run/admin/auth)
  ],

  // ---------------------------------------------------------------------------
  // PROVIDERS - SERVICES MÉTIER
  // ---------------------------------------------------------------------------
  providers: [
    // Services Participants
    ParticipantService,       // CRUD participants
    NotificationService,      // SMS et Email
    FileUploadService,        // Upload certificats

    // Services Administration
    AdminService,             // CRUD administrateurs
    AdminAuthService,         // Authentification JWT
  ],

  // ---------------------------------------------------------------------------
  // EXPORTS - SERVICES ACCESSIBLES AUX AUTRES MODULES
  // ---------------------------------------------------------------------------
  exports: [
    ParticipantService,
    AdminService,
  ],
})
export class MadibaRunModule {}
