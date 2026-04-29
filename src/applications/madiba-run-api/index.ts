/**
 * =============================================================================
 * MADIBA RUN API - EXPORTS CENTRALISÉS
 * =============================================================================
 * 
 * Ce fichier centralise tous les exports du module Madiba Run pour
 * faciliter les imports dans d'autres parties de l'application.
 */

// Module principal
export * from './madiba-run.module';

// -----------------------------------------------------------------------------
// ENTITÉS MONGODB
// -----------------------------------------------------------------------------
export * from './entities/participant.entity';
export * from './entities/admin.entity';

// -----------------------------------------------------------------------------
// DTOs - VALIDATION DES DONNÉES
// -----------------------------------------------------------------------------
export * from './dto';

// -----------------------------------------------------------------------------
// SERVICES - PARTICIPANTS
// -----------------------------------------------------------------------------
export * from './participant.service';
export * from './services/notification.service';
export * from './services/file-upload.service';

// -----------------------------------------------------------------------------
// SERVICES - ADMINISTRATION
// -----------------------------------------------------------------------------
export * from './services/admin.service';
export * from './services/admin-auth.service';

// -----------------------------------------------------------------------------
// CONTRÔLEURS
// -----------------------------------------------------------------------------
export * from './participant.controller';
// export * from './admin-auth.controller';
