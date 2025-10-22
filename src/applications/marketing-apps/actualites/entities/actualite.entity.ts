import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ArticleActualite extends Document {

  @Prop({ required: true, maxlength: 1000 })
  imageLink: string;

  @Prop({ required: true, minlength: 5, maxlength: 1000 })
  titre: string;

  @Prop({ required: true, minlength: 50, maxlength: 6000 })
  description: string;

  @Prop({ required: true, })
  categorie: string;

  @Prop({ required: true, })
  refSite: string;

  @Prop({ required: true, })
  statutVisibility: string;

  @Prop({ required: true, enum: ['principal', 'secondaire', 'brouillon'] })
  typeArticle: string;

  @Prop({ required: false, default: 0 })
  nbrVue: number;

}
export const ArticleSchema = SchemaFactory.createForClass(ArticleActualite);
  


 
@Schema({ timestamps: true }) 
export class GallerieImage extends Document {

  @Prop({ required: true, maxlength: 1000 })
  imageLink: string;

  @Prop({ required: true, default: false })
  isMediathequeImage: boolean;

  @Prop({ required: false, default: 0 })
  size: number;

}
export const GallerieImageSchema = SchemaFactory.createForClass(GallerieImage);
  


@Schema({ timestamps: true })
export class NewsLetteEmail extends Document {
  @Prop({ required: true, maxlength: 1000 })
  email: string;
}
export const NewsLetteEmailSchema = SchemaFactory.createForClass(NewsLetteEmail);
  