import { Injectable, Inject } from '@nestjs/common';
import { Client } from '@microsoft/microsoft-graph-client';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class MailService {
    constructor(
        @Inject('GRAPH_CLIENT') private readonly graphClient: Client,
        private readonly configService: ConfigService,
    ) { }

    async sendEmailToValidateur(
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
                                        Veuillez valider la demande de billet de voyage de Mr/Mme <span style="font-weight: bold; color: #463c3aff;">${employeeName}</span> en cliquant sur le bouton ci-dessous.
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






    // Additional email to notify employee about approval/rejection can be added here

    async sendTicketStatusNotification(
        employeeEmail: string,
        employeeName: string,
        status: string,
        rejectionReason?: string,
    ) {
        const isApproved = status === 'APPROVED';

        const statusConfig = {
            ['APPROVED']: {
                subject: '✅ Votre demande de billet d\'avion a été approuvée',
                headerBgColor: '#28a745',
                iconEmoji: '✈️',
                statusText: 'APPROUVÉE',
                statusColor: '#28a745',
                message: 'Nous avons le plaisir de vous informer que votre demande de billet d\'avion a été <strong>approuvée</strong>.',
                subMessage: 'Notre équipe RH vous contactera prochainement pour finaliser les détails de votre voyage.',
            },
            ['REJECTED']: {
                subject: '❌ Votre demande de billet d\'avion a été refusée',
                headerBgColor: '#dc3545',
                iconEmoji: '📋',
                statusText: 'REFUSÉE',
                statusColor: '#dc3545',
                message: 'Nous regrettons de vous informer que votre demande de billet d\'avion a été <strong>refusée</strong>.',
                subMessage: rejectionReason
                    ? `<strong>Motif du refus :</strong> ${rejectionReason}`
                    : 'Pour plus d\'informations, veuillez contacter votre responsable hiérarchique.',
            },
        };

        const config = statusConfig[status];

        try {
            const mail = {
                subject: config.subject,
                toRecipients: [
                    {
                        emailAddress: {
                            address: employeeEmail,
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
                            <title>${config.subject}</title>
                        </head>
                        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.12); margin-top: 20px; margin-bottom: 20px;">
                                
                                <!-- Header avec gradient -->
                                <div style="background: linear-gradient(135deg, ${config.headerBgColor} 0%, ${isApproved ? '#218838' : '#c82333'} 100%); padding: 40px 20px; text-align: center;">
                                    <img src="https://www.kadjigroup.com/wp-content/uploads/2023/06/Kadji-logo-4-300x300.png" alt="Kadji Group Logo" style="width: 160px; height: auto; margin-bottom: 20px;">
                                    <div style="font-size: 60px; margin-bottom: 15px;">${config.iconEmoji}</div>
                                    <h1 style="color: #483e3eff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
                                        Demande ${config.statusText}
                                    </h1>
                                </div>

                                <!-- Status Badge -->
                                <div style="text-align: center; margin-top: -20px;">
                                    <span style="background-color: #ffffff; color: ${config.statusColor}; padding: 10px 30px; border-radius: 50px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 2px solid ${config.statusColor};">
                                        ${config.statusText}
                                    </span>
                                </div>
                                
                                <!-- Content -->
                                <div style="padding: 40px 35px;">
                                    <h2 style="color: #333333; margin-top: 0; font-size: 22px; margin-bottom: 25px;">
                                        Bonjour <span style="color: ${config.statusColor};">${employeeName}</span>,
                                    </h2>
                                    
                                    <div style="background-color: ${isApproved ? '#d4edda' : '#f8d7da'}; border-left: 4px solid ${config.statusColor}; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 25px;">
                                        <p style="color: #333333; font-size: 16px; line-height: 1.7; margin: 0;">
                                            ${config.message}
                                        </p>
                                    </div>

                                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                                        <p style="color: #555555; font-size: 15px; line-height: 1.6; margin: 0;">
                                            ${config.subMessage}
                                        </p>
                                    </div>

                                    ${isApproved ? `
                                    <!-- Next Steps for Approved -->
                                    <div style="margin-top: 30px;">
                                        <h3 style="color: #333333; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #28a745; padding-bottom: 8px; display: inline-block;">
                                            📌 Prochaines étapes
                                        </h3>
                                        <ul style="color: #555555; font-size: 14px; line-height: 1.8; padding-left: 20px;">
                                            <li>Vous recevrez une confirmation avec les détails du vol</li>
                                            <li>Vérifiez vos documents de voyage (passeport, visa si nécessaire)</li>
                                            <li>Contactez RH pour toute question complémentaire</li>
                                        </ul>
                                    </div>
                                    ` : `
                                    <!-- Next Steps for Rejected -->
                                    <div style="margin-top: 30px;">
                                        <h3 style="color: #333333; font-size: 16px; margin-bottom: 15px; border-bottom: 2px solid #dc3545; padding-bottom: 8px; display: inline-block;">
                                            📌 Que faire maintenant ?
                                        </h3>
                                        <ul style="color: #555555; font-size: 14px; line-height: 1.8; padding-left: 20px;">
                                            <li>Contactez votre responsable pour plus de détails</li>
                                            <li>Vous pouvez soumettre une nouvelle demande si nécessaire</li>
                                            <li>L'équipe RH reste à votre disposition</li>
                                        </ul>
                                    </div>
                                    `}
                                </div>

                                <!-- Contact Section -->
                                <div style="background-color: #463c3aff; padding: 25px; text-align: center;">
                                    <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px;">
                                        Besoin d'aide ? Contactez-nous
                                    </p>
                                   
                                </div>

                                <!-- Footer -->
                                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                                    <img src="https://www.kadjigroup.com/wp-content/uploads/2023/07/cropped-KadjiGroup-LOGO_horizontal_White-2-768x263.png" alt="Kadji Group" style="width: 100px; height: auto; opacity: 0.6; margin-bottom: 10px; filter: grayscale(100%);">
                                    <p style="color: #999999; font-size: 12px; margin: 0;">
                                        &copy; ${new Date().getFullYear()} Kadji Group. Tous droits réservés.
                                    </p>
                                    <p style="color: #bbbbbb; font-size: 11px; margin: 8px 0 0;">
                                        Ceci est un email automatique, merci de ne pas y répondre.
                                    </p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `,
                },
            };
            await this.graphClient.api(`/users/${this.configService.get('MAIL_FROM')}/sendMail`)
                .post({ message: mail });

            return { success: true, message: `Email de notification (${status}) envoyé avec succès à ${employeeEmail}` };
        } catch (error) {
            console.error('Error sending status notification email:', error);
            throw error;
        }
    }


    /**
     * Notifie le directeur qu'une demande de billet d'avion a été approuvée
     * et est en attente de traitement final
     */
    async sendTicketPendingFinalApprovalToDirector(
        directorName: string,
        employeeName: string,
        employeeEntreprise: string,
        employeeDepartment: string,
        destination: string,
        travelDate: string,
    ) {
        try {
            const mail = {
                subject: '🎫 Nouvelle demande de billet approuvée - Action requise',
                toRecipients: [
                    {
                        emailAddress: {
                            address: "christian.nana@sa-ucb.com",
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
                            <title>Demande de billet en attente de traitement</title>
                        </head>
                        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.12); margin-top: 20px; margin-bottom: 20px;">
                                
                                <!-- Header avec gradient orange/doré pour action requise -->
                                <div style="background: linear-gradient(135deg, #b45c4eff 0%, #d65845ff 50%, #e8a849 100%); padding: 40px 20px; text-align: center; position: relative;">
                                    <img src="https://www.kadjigroup.com/wp-content/uploads/2023/06/Kadji-logo-4-300x300.png" alt="Kadji Group Logo" style="width: 160px; height: auto; margin-bottom: 20px;">
                                    <div style="font-size: 30px; margin-bottom: 15px;">✈️</div>
                                    <h1 style="color: #4e4242ff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;">
                                        DEMANDE APPROUVÉE
                                    </h1>
                                    <p style="color: rgba(73, 125, 246, 1); margin: 10px 0 0; font-size: 14px;">
                                        En attente de traitement final
                                    </p>
                                </div>

                             
                               
                                <!-- Content -->
                                <div style="padding: 40px 5px;">
                                    <h2 style="color: #333333; margin-top: 0; font-size: 18px; margin-bottom: 25px;">
                                        DEPARTEMENT <span style="color: #b45c4eff;">${directorName}</span>,
                                    </h2>
                                    
                                    <div style="background: linear-gradient(to right, #fff8e1, #ffffff); border-left: 4px solid #ff9800; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 25px;">
                                        <p style="color: #333333; font-size: 16px; line-height: 1.7; margin: 0;">
                                            Une demande de billet d'avion a été <strong style="color: #28a745;">approuvée</strong> et nécessite votre <strong>traitement final</strong>.
                                        </p>
                                    </div>

                                    <!-- Détails de la demande -->
                                    <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                                        <h3 style="color: #463c3aff; font-size: 16px; margin: 0 0 20px; padding-bottom: 10px; border-bottom: 2px solid #b45c4eff;">
                                            📋 Détails de la demande
                                        </h3>
                                        <table style="width: 100%; border-collapse: collapse;">
                                            <tr>
                                                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #777777; font-size: 14px; width: 40%;">
                                                    👤 Employé
                                                </td>
                                                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 14px; font-weight: 600;">
                                                    ${employeeName}
                                                </td>
                                            </tr>
                                             <tr>
                                                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #777777; font-size: 14px;">
                                                    🏢 Entreprise
                                                </td>
                                                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 14px; font-weight: 600;">
                                                    ${employeeEntreprise}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #777777; font-size: 14px;">
                                                    🏢 Département
                                                </td>
                                                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 14px; font-weight: 600;">
                                                    ${employeeDepartment}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #777777; font-size: 14px;">
                                                    📍 Destination
                                                </td>
                                                <td style="padding: 12px 0; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 14px; font-weight: 600;">
                                                    ${destination}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 12px 0; color: #777777; font-size: 14px;">
                                                    📅 Date de voyage
                                                </td>
                                                <td style="padding: 12px 0; color: #333333; font-size: 14px; font-weight: 600;">
                                                    ${travelDate}
                                                </td>
                                            </tr>
                                        </table>
                                    </div>

                                    <!-- Action Button -->
                                    <!-- <div style="text-align: center; margin: 35px 0;">
                                        <a href="${"linkToProcess"}" style="background: linear-gradient(135deg, #b45c4eff 0%, #d65845ff 100%); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(180, 92, 78, 0.4); text-transform: uppercase; letter-spacing: 1px;">
                                            🎫 Traiter la demande
                                        </a>
                                    </div> --> 

                                    <!-- Instructions -->
                                    <div style="margin-top: 30px; background-color: #e8f4fd; border-radius: 8px; padding: 20px;">
                                        <h3 style="color: #1976d2; font-size: 14px; margin: 0 0 12px; display: flex; align-items: center;">
                                            💡 Actions à effectuer
                                        </h3>
                                        <ul style="color: #555555; font-size: 13px; line-height: 1.8; padding-left: 20px; margin: 0;">
                                            <li>Vérifier les détails de la demande</li>
                                            <li>Procéder à la réservation du billet</li>
                                            <li>Confirmer les informations de voyage à l'employé</li>
                                        </ul>
                                    </div>

                                </div>

                                <!-- Contact Section -->
                                <div style="background-color: #463c3aff; padding: 15px; text-align: center;">
                                    <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px;">
                                        Questions ? Contactez l'équipe RH
                                    </p>
                                </div>

                                <!-- Footer -->
                                <div style="background-color: #f8f9fa; padding: 10px; text-align: center; border-top: 1px solid #eeeeee;">
                                    <img src="https://www.kadjigroup.com/wp-content/uploads/2023/07/cropped-KadjiGroup-LOGO_horizontal_White-2-768x263.png" alt="Kadji Group" style="width: 100px; height: auto; opacity: 0.6; margin-bottom: 10px; filter: grayscale(100%);">
                                    <p style="color: #999999; font-size: 12px; margin: 0;">
                                        &copy; ${new Date().getFullYear()} Kadji Group. Tous droits réservés.
                                    </p>
                                    <p style="color: #bbbbbb; font-size: 11px; margin: 8px 0 0;">
                                        Ceci est un email automatique, merci de ne pas y répondre.
                                    </p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `,
                },
            };
            await this.graphClient.api(`/users/${this.configService.get('MAIL_FROM')}/sendMail`)
                .post({ message: mail });

            return { success: true, message: `Notification envoyée au directeur pour traitement final` };
        } catch (error) {
            console.error('Error sending director notification email:', error);
            throw error;
        }
    }
}










