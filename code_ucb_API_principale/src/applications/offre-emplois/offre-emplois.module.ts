import { Module } from '@nestjs/common';
import { OffreEmploisService } from './offre-emplois.service';
import { OffreEmploisController } from './offre-emplois.controller';

@Module({
  controllers: [OffreEmploisController],
  providers: [OffreEmploisService],
})
export class OffreEmploisModule {}
