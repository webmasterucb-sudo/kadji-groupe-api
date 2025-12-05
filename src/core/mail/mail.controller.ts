import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Post('test')
    async sendTestEmail(@Body() body: { email: string; name: string; message: string; linkToValidated: string }) {
        return await this.mailService.sendEmailToEmployee(
            body.email,
            'Test Email from UCB Connect',
            body.name,
            body.message,
            body.linkToValidated,
        );
    }
}
