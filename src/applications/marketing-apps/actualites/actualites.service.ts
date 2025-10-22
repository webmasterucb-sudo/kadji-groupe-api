import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateArticleDto, CreateGallerieDto } from './dto/create-actualite.dto';
import { ArticleActualite, GallerieImage, NewsLetteEmail } from './entities/actualite.entity';
import { UpdateArticleDto } from './dto/update-actualite.dto';


@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(ArticleActualite.name) private articleModel: Model<ArticleActualite>, 
    @InjectModel(GallerieImage.name) private gallerieModel: Model<GallerieImage>,
    @InjectModel(NewsLetteEmail.name) private newsLetterModel: Model<NewsLetteEmail>,
  ) { }

  create(createArticleDto: CreateArticleDto): Promise<ArticleActualite> {
    const createdArticle = new this.articleModel(createArticleDto);
    return createdArticle.save();
  }

  async findAll(): Promise<ArticleActualite[]> {
    let datas = await this.articleModel.find().sort({ createdAt: -1 }).limit(50).exec();
    return datas;
  }

  async findAllByrefSite(refSite): Promise<ArticleActualite[]> {
    return this.articleModel.find({ "refSite": refSite }).sort({ createdAt: -1 }).limit(50).exec();
  }

  async onIncrementVueNbr(id: string) {
    let update = await this.articleModel.findByIdAndUpdate(id, { $inc: { nbrVue: 1 } }, { new: true }).exec();
    return true;
  }


  async findOne(id: string): Promise<ArticleActualite> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      throw new NotFoundException(`Article avec l'ID ${id} non trouvé`);
    }
    return article;
  }


  async update(id: string, updateArticleDto: UpdateArticleDto): Promise<ArticleActualite> {
    const updatedArticle = await this.articleModel
      .findByIdAndUpdate(id, updateArticleDto, { new: true })
      .exec();
    if (!updatedArticle) {
      throw new NotFoundException(`Article avec l'ID ${id} non trouvé`);
    }
    return updatedArticle;
  }

  async delete(id: string): Promise<void> {
    const result = await this.articleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Article avec l'ID ${id} non trouvé`);
    }
  }



  //////////////////////////    GESTION DE LA GALLERIE  ///////////////////////


  async onfindAllGallerie() {
    let datas = await this.gallerieModel.find().sort({ createdAt: -1 }).limit(75).exec();
    return datas;
  }


  onCreateGallerie(gallerieDto: CreateGallerieDto): Promise<GallerieImage> {
    const createdArticle = new this.gallerieModel(gallerieDto);
    return createdArticle.save();
  }


  async onAjoutMediatheque(id: string, isMediathequeImage: boolean){
    const meditheque = await this.gallerieModel.findByIdAndUpdate(id, {"isMediathequeImage": isMediathequeImage})
    return true;
  }


  async onReadAllMediathequeImage(){
    let datas = await this.gallerieModel.find().where({"isMediathequeImage": true}).sort({ updatedAt: -1 }).limit(105).exec();
    return datas;
  }

  async onDeleteGallerie(id: string): Promise<void> {
    const result = await this.gallerieModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Article avec l'ID ${id} non trouvé`);
    }
  }



  //////////////////////////    GESTION DES NEWS LETTER  ///////////////////////


  onCreateNewsLetter(email: string): Promise<NewsLetteEmail> {
    const newsLetter = new this.newsLetterModel({"email": email});
    return newsLetter.save();
  }

  async onfindAllNewsLetter() {
    let datas = await this.newsLetterModel.find().sort({ createdAt: -1 }).limit(275).exec();
    return datas;
  }


   async onDeleteNewsLetter(id: string): Promise<void> {
    const result = await this.newsLetterModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Article avec l'ID ${id} non trouvé`);
    }
  }

}



