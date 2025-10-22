import { Module } from '@nestjs/common';
import { JobOffersService, } from './offres-emplois.service';
import { JobOffersController, } from './offres-emplois.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JobOffer, JobOfferSchema } from './schemas/offres-emplois.schema';

@Module({
   imports: [
    MongooseModule.forFeature([
      { name: JobOffer.name, schema: JobOfferSchema }
    ]),
  ],
  controllers: [JobOffersController],
  providers: [JobOffersService],
  exports: [JobOffersService],
})
export class OffresEmploisModule {}
