import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@microsoft/microsoft-graph-client';
import { Participant } from '../entities/participant.entity';

interface SmsResponse {
  success: boolean;
  message: string;
  transactionId?: string;
}

interface EmailResponse {
  success: boolean;
  message: string;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject('GRAPH_CLIENT') private readonly graphClient: Client,
  ) {}

  /**
   * Envoie un SMS de confirmation d'inscription au participant
   */
  async sendSmsConfirmation(participant: Participant): Promise<SmsResponse> {
    try {
      const smsApiUrl = this.configService.get<string>('SMS_API_URL') || 'https://api-public.ekotech.cm';
      const smsUsername = this.configService.get<string>('SMS_USERNAME');
      const smsPassword = this.configService.get<string>('SMS_PASSWORD');
      const smsSender = this.configService.get<string>('SMS_SENDER') || 'UCB';

      const message = this.buildSmsMessage(participant);

      // Appel à l'API SMS Ekotech (format URL-encoded requis)
      const response = await fetch(`${smsApiUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: smsUsername || '',
          password: smsPassword || '',
          msisdn: participant.telephone,
          msg: message,
          sender: smsSender,
        }).toString(),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        this.logger.error(`Erreur envoi SMS: ${errorData}`);
        return {
          success: false,
          message: `Erreur lors de l'envoi du SMS: ${response.statusText}`,
        };
      }

      const data = await response.json();
      
      // Vérifier les codes d'erreur de l'API Ekotech
      if (data.code && data.code !== 1002) {
        this.logger.error(`Erreur API SMS: code ${data.code} - ${data.message}`);
        return {
          success: false,
          message: data.message || this.getEkotechErrorMessage(data.code),
        };
      }

      this.logger.log(`SMS envoyé avec succès à ${participant.telephone}`);
      
      return {
        success: true,
        message: 'SMS envoyé avec succès',
        transactionId: data.data?.results?.[0]?.ticket,
      };
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi du SMS: ${error}`);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      return {
        success: false,
        message: `Erreur technique lors de l'envoi du SMS: ${errorMessage}`,
      };
    }
  }

  /**
   * Envoie un email de confirmation d'inscription au participant
   */
  async sendEmailConfirmation(participant: Participant): Promise<EmailResponse> {
    try {
      const mailFrom = this.configService.get<string>('MAIL_FROM');
      const eventDate = this.configService.get<string>('MADIBA_RUN_DATE') || '21 Juin 2026';
      const eventLocation = this.configService.get<string>('MADIBA_RUN_LOCATION') || 'Douala';

      const mail = {
        subject: '🏃 Confirmation d\'inscription - Madiba Run 2026',
        toRecipients: [
          {
            emailAddress: {
              address: participant.email,
            },
          },
        ],
        body: {
          contentType: 'HTML',
          content: this.buildEmailTemplate(participant, eventDate, eventLocation),
        },
      };

      await this.graphClient
        .api(`/users/${mailFrom}/sendMail`)
        .post({ message: mail });

      this.logger.log(`Email envoyé avec succès à ${participant.email}`);
      
      return {
        success: true,
        message: 'Email envoyé avec succès',
      };
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email: ${error}`);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      return {
        success: false,
        message: `Erreur technique lors de l'envoi de l'email: ${errorMessage}`,
      };
    }
  }

  /**
   * Envoie un SMS et un email de confirmation
   */
  async sendAllNotifications(participant: Participant): Promise<{
    sms: SmsResponse;
    email: EmailResponse;
  }> {
    const [smsResult, emailResult] = await Promise.allSettled([
      this.sendSmsConfirmation(participant),
      this.sendEmailConfirmation(participant),
    ]);

    return {
      sms: smsResult.status === 'fulfilled' 
        ? smsResult.value 
        : { success: false, message: smsResult.reason?.message || 'Erreur SMS' },
      email: emailResult.status === 'fulfilled' 
        ? emailResult.value 
        : { success: false, message: emailResult.reason?.message || 'Erreur Email' },
    };
  }

  /**
   * Envoie un SMS de validation de l'inscription
   */
  async sendValidationSms(participant: Participant): Promise<SmsResponse> {
    try {
      const smsApiUrl = this.configService.get<string>('SMS_API_URL') || 'https://api-public.ekotech.cm';
      const smsUsername = this.configService.get<string>('SMS_USERNAME');
      const smsPassword = this.configService.get<string>('SMS_PASSWORD');
      const smsSender = this.configService.get<string>('SMS_SENDER') || 'MADIBARUN';

      const message = `MADIBA RUN 4 HEALTH  - 2ème édition: Felicitations ${participant.prenom}! Inscription validee. Dossard: ${participant.numeroDossard || 'A venir'}. RDV le 21 Juin 2026! InfoLine: 683701188`;

      const response = await fetch(`${smsApiUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: smsUsername || '',
          password: smsPassword || '',
          msisdn: participant.telephone,
          msg: message,
          sender: smsSender,
        }).toString(),
      });

      if (!response.ok) {
        return {
          success: false,
          message: `Erreur lors de l'envoi du SMS de validation`,
        };
      }

      const data = await response.json();
      
      if (data.code && data.code !== 1002) {
        return {
          success: false,
          message: data.message || this.getEkotechErrorMessage(data.code),
        };
      }

      return {
        success: true,
        message: 'SMS de validation envoyé',
      };
    } catch (error) {
      this.logger.error(`Erreur SMS validation: ${error}`);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Construit le message SMS de confirmation
   * Max 160 caracteres pour tenir en 1 seul SMS (encodage GSM-7)
   */
  private buildSmsMessage(participant: Participant): string {
    return `Madiba Run: Bienvenue ${participant.prenom}! Inscription confirmee (${participant.categorie} - ${participant.distanceParcourir}). RDV le 21 Juin 2026. InfoLine: 683701188`;
  }

  /**
   * Construit le template email HTML de confirmation
   */
  private buildEmailTemplate(
    participant: Participant, 
    eventDate: string, 
    eventLocation: string
  ): string {
    const categorieDisplay = this.getCategorieDisplay(participant.categorie);
    
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation d'inscription - Madiba Run 4 Health 2026</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.1); margin-top: 20px; margin-bottom: 20px;">
          
          <!-- Header -->
          <div style="background-color: #1e3a5f; padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 1px;"> MADIBA RUN 4 HEALTH 2026 </h1>
            <p style="color: #a8d4ff; margin: 10px 0 0; font-size: 16px;">Course solidaire pour la santé</p>
          </div>
          
          <!-- Bandeau de confirmation -->
          <div style="background-color: #10b981; padding: 15px 20px; text-align: center;">
            <span style="color: #ffffff; font-size: 18px; font-weight: 600;">✅ Inscription Confirmée!</span>
          </div>
          
          <!-- Contenu principal -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1e3a5f; margin-top: 0; font-size: 24px; margin-bottom: 20px;">
              Bonjour ${participant.prenom} ${participant.nom},
            </h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.7; margin-bottom: 25px;">
              Nous sommes ravis de vous confirmer votre inscription à la 2eme édition du <strong>Madiba Run 4 Health 2026.</strong>! 
              Vous serez contacté très prochainement pour la suite des informations.
            </p>
        
            <!-- Carte récapitulatif -->
            <div style="background-color: #f8fafc; border-radius: 10px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #2d5a87;">
              <h3 style="color: #1e3a5f; margin-top: 0; font-size: 18px; margin-bottom: 20px;">📋 Récapitulatif de votre inscription</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-size: 14px; width: 40%;">Catégorie</td>
                  <td style="padding: 10px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${categorieDisplay}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb;">Distance</td>
                  <td style="padding: 10px 0; color: #1f2937; font-size: 14px; font-weight: 600; border-top: 1px solid #e5e7eb;">${participant.distanceParcourir}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb;">Point de départ</td>
                  <td style="padding: 10px 0; color: #1f2937; font-size: 14px; font-weight: 600; border-top: 1px solid #e5e7eb;">${participant.pointDepart}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb;">Date de l'événement</td>
                  <td style="padding: 10px 0; color: #1f2937; font-size: 14px; font-weight: 600; border-top: 1px solid #e5e7eb;">${eventDate}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb;">Lieu</td>
                  <td style="padding: 10px 0; color: #1f2937; font-size: 14px; font-weight: 600; border-top: 1px solid #e5e7eb;">${eventLocation}</td>
                </tr>
              </table>
            </div>

            <!-- Prochaines étapes -->
            <div style="background-color: #fef3c7; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
              <h4 style="color: #92400e; margin-top: 0; font-size: 16px; display: flex; align-items: center;">
                ⏳ Prochaines étapes
              </h4>
              <ul style="color: #78350f; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>1- Présentation et Validation  de votre certificat Médical</li>
                <li>2- Attribution de votre numéro de dossard</li>
                <li>3- Réception de votre kit de participation</li>
              </ul>
            </div>

            <!-- Bouton de contact -->
            <div style="text-align: center; margin: 35px 0;">
              <a href="mailto:contact@madiba-run.cm" style="background-color: #2d5a87; color: #ffffff; padding: 15px 35px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block;">
                Nous contacter
              </a>
            </div>

            <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin-top: 30px; text-align: center;">
              Une question? Contactez-nous au <strong style="color: #1e3a5f;">(+237) 683 701 188</strong><br>
              ou par email à <a href="mailto:contact@madiba-run.cm" style="color: #2d5a87;">contact@madiba-run.cm</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #1e3a5f; padding: 25px; text-align: center;">
            <p style="color: #a8d4ff; font-size: 13px; margin: 0;">
              InfoLine: (+237) 683 701 188
            </p>
            <p style="color: #a8d4ff; font-size: 13px; margin: 5px 0 0;">
              &copy; ${new Date().getFullYear()} Madiba Run. Tous droits réservés.
            </p>
            <p style="color: #6b8eb3; font-size: 12px; margin: 8px 0 0;">
              Courir pour la santé. Rejoignez-nous le 21 Juin 2026 à Douala!
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Retourne l'affichage de la catégorie
   */
  private getCategorieDisplay(categorie: string): string {
    const categories: Record<string, string> = {
      'WALKATHON': 'Walkathon (Marche)',
      'HALF_MARATHON': "Semi-Marathon",
    };
    return categories[categorie] || categorie;
  }

  /**
   * Retourne le message d'erreur correspondant au code Ekotech
   */
  private getEkotechErrorMessage(code: number): string {
    const errors: Record<number, string> = {
      [-1]: 'Authentification échouée',
      [-2]: 'Numéro de destination invalide',
      [-3]: 'Opérateur invalide',
      [-4]: 'Aucune route définie pour cette destination',
      [-5]: 'Transaction non trouvée',
      [-6]: 'Paramètre "method" non trouvé',
      [-7]: 'Heure d\'envoi non autorisée',
      [-8]: 'Data Coding Scheme invalide',
      [-9]: 'Service ID non trouvé',
      [-10]: 'Message trop long',
      [-11]: 'Crédit insuffisant',
      [-12]: 'Paramètre invalide',
    };
    return errors[code] || `Erreur inconnue (code: ${code})`;
  }
}
