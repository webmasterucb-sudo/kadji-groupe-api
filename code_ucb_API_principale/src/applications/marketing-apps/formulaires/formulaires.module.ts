import { Module } from '@nestjs/common';
import { FormulairesService } from './formulaires.service';
import { FormulairesController } from './formulaires.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactForm, ContactFormSchema } from './entities/formulaire.entity';

@Module({
   imports: [
       MongooseModule.forFeature([{ name: ContactForm.name, schema: ContactFormSchema }]),
    ],
  controllers: [FormulairesController],
  providers: [FormulairesService],
})
export class FormulairesModule {}
