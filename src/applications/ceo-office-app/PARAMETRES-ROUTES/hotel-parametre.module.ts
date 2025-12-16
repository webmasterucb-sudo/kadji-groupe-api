import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelParametreService } from './hotel-parametre.service';
import { HotelParametreController } from './hotel-parametre.controller';
import {
  HotelParametre,
  HotelParametreSchema,
} from './entities/hotel-parametre.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HotelParametre.name, schema: HotelParametreSchema },
    ]),
  ],
  controllers: [HotelParametreController],
  providers: [HotelParametreService],
  exports: [HotelParametreService],
})
export class HotelParametreModule {}
