import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleActualite, ArticleSchema, GallerieImage, GallerieImageSchema, NewsLetteEmail, NewsLetteEmailSchema } from './entities/actualite.entity';
import { ArticlesService } from './actualites.service';
import { ArticlesController } from './actualites.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ArticleActualite.name, schema: ArticleSchema },
      { name: GallerieImage.name, schema: GallerieImageSchema },
      { name: NewsLetteEmail.name, schema: NewsLetteEmailSchema },
    ]),
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ActualitesModule { }
