import { Injectable, Inject } from '@nestjs/common';
import { Client } from '@microsoft/microsoft-graph-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    constructor(
        @Inject('GRAPH_CLIENT') private readonly graphClient: Client,
        private readonly configService: ConfigService,
    ) { }

    async sendEmailToEmployee(
        email: string,
        subject: string,
        employeeName: string,
        message: string,
        linkToValidated: string,
    ) {
        try {
            const mail = {
                subject: subject,
                toRecipients: [
                    {
                        emailAddress: {
                            address: email,
                        },
                    },
                ],
                body: {
                    contentType: 'HTML',
                    content: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>${subject}</title>
                        </head>
                        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-top: 20px; margin-bottom: 20px;">
                                <!-- Header -->
                                <div style="background-color: #b45c4eff; padding: 30px 20px; text-align: center;">
                                    <img src="https://www.kadjigroup.com/wp-content/uploads/2023/07/cropped-KadjiGroup-LOGO_horizontal_White-2-768x263.png" alt="Kadji Group Logo" style="width: 180px; height: auto; margin-bottom: 10px;">
                                    <h1 style="color: #ffffff; margin: 10px 0 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">Demande Billet d'avion</h1>
                                </div>
                                
                                <!-- Content -->
                                <div style="padding: 40px 30px;">
                                    <h2 style="color: #333333; margin-top: 0; font-size: 20px; margin-bottom: 20px;">Bonjour,</h2>
                                    
                                    <div style="color: #555555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                        Veuillez valider la demande de billet de voyage de <span style="font-weight: bold; color: #463c3aff;">${employeeName}</span> en cliquant sur le bouton ci-dessous.
                                    </div>

                                    <!-- Action Button -->
                                    <div style="text-align: center; margin: 35px 0;">
                                        <a href="${linkToValidated}" style="background-color: #d65845ff; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; transition: background-color 0.3s ease; box-shadow: 0 2px 4px rgba(195, 35, 7, 0.3);">
                                            Valider la demande
                                        </a>
                                    </div>

                                    <p style="color: #777777; font-size: 14px; line-height: 1.5; margin-top: 40px; border-top: 1px solid #eeeeee; padding-top: 20px;">
                                        Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :<br>
                                        <a href="${linkToValidated}" style="color: #c32307; text-decoration: none; word-break: break-all;">${linkToValidated}</a>
                                    </p>
                                </div>

                                <!-- Footer -->
                                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                                    <p style="color: #999999; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Kadji Group. Tous droits réservés.</p>
                                    <p style="color: #999999; font-size: 12px; margin: 5px 0 0;">Ceci est un email automatique, merci de ne pas y répondre.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `,
                },
            };

            await this.graphClient.api(`/users/${this.configService.get('MAIL_FROM')}/sendMail`)
                .post({ message: mail });

            return { success: true, message: 'Email sent successfully' };
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}
