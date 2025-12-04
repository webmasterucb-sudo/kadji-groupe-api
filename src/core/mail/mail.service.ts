import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendEmailToEmployee(
        email: string,
        subject: string,
        employeeName: string,
        message: string,
    ) {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: subject,
                template: './employee-notification', // The name of the template file
                context: {
                    // Data to be sent to template files
                    name: employeeName,
                    message: message,
                },
            });
            return { success: true, message: 'Email sent successfully' };
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}
