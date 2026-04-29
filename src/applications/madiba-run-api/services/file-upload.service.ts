import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface UploadResponse {
  success: boolean;
  url?: string;
  message: string;
  fileName?: string;
}

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private readonly allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
  ];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

  constructor(private readonly configService: ConfigService) {}

  /**
   * Upload un certificat médical vers l'API de stockage externe
   */
  async uploadCertificatMedical(
    file: Express.Multer.File,
    participantId: string,
    participantName: string,
  ): Promise<UploadResponse> {
    try {
      // Validation du fichier
      this.validateFile(file);

      const storageApiUrl = this.configService.get<string>('STORAGE_API_URL');
      const storageApiKey = this.configService.get<string>('STORAGE_API_KEY');

      if (!storageApiUrl || !storageApiKey) {
        throw new BadRequestException(
          'Configuration du service de stockage manquante',
        );
      }

      // Génération du nom de fichier unique
      const timestamp = Date.now();
      const sanitizedName = participantName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_');
      const extension = this.getFileExtension(file.originalname);
      const fileName = `certificats/${timestamp}_${sanitizedName}_${participantId}.${extension}`;

      // Création du FormData pour l'upload
      const formData = new FormData();
      const uint8Array = new Uint8Array(file.buffer);
      const blob = new Blob([uint8Array], { type: file.mimetype });
      formData.append('file', blob, fileName);
      formData.append('folder', 'madiba-run/certificats');
      formData.append('participantId', participantId);

      // Appel à l'API de stockage externe
      const response = await fetch(`${storageApiUrl}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${storageApiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        this.logger.error(`Erreur upload certificat: ${errorData}`);
        return {
          success: false,
          message: `Erreur lors de l'upload: ${response.statusText}`,
        };
      }

      const data = await response.json();
      this.logger.log(`Certificat uploadé avec succès: ${data.url}`);

      return {
        success: true,
        url: data.url || data.fileUrl,
        message: 'Certificat médical uploadé avec succès',
        fileName: fileName,
      };
    } catch (error) {
      this.logger.error(`Erreur lors de l'upload du certificat: ${error}`);
      if (error instanceof BadRequestException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      return {
        success: false,
        message: `Erreur technique: ${errorMessage}`,
      };
    }
  }

  /**
   * Valide le fichier uploadé
   */
  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Type de fichier non autorisé. Types acceptés: PDF, JPEG, PNG`,
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `Le fichier est trop volumineux. Taille maximale: ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }
  }

  /**
   * Extrait l'extension du fichier
   */
  private getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop()!.toLowerCase() : 'pdf';
  }

  /**
   * Supprime un certificat médical du stockage
   */
  async deleteCertificatMedical(fileUrl: string): Promise<boolean> {
    try {
      const storageApiUrl = this.configService.get<string>('STORAGE_API_URL');
      const storageApiKey = this.configService.get<string>('STORAGE_API_KEY');

      const response = await fetch(`${storageApiUrl}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storageApiKey}`,
        },
        body: JSON.stringify({ url: fileUrl }),
      });

      return response.ok;
    } catch (error) {
      this.logger.error(`Erreur suppression certificat: ${error}`);
      return false;
    }
  }
}
