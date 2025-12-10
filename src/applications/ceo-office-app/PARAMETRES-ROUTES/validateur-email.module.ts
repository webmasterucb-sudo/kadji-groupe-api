import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidateurEmailService } from './validateur-email.service';
import { ValidateurEmailController } from './validateur-email.controller';
import { ValidateurEmail, ValidateurEmailSchema } from './entities/validateur-email.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ValidateurEmail.name, schema: ValidateurEmailSchema },
        ]),
    ],
    controllers: [ValidateurEmailController],
    providers: [ValidateurEmailService],
    exports: [ValidateurEmailService],
})
export class ValidateurEmailModule { }
