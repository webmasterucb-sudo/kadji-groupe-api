import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, } from '@nestjs/common';

import { ArticleActualite, GallerieImage, NewsLetteEmail } from './entities/actualite.entity';
import { ArticlesService } from './actualites.service';
import { CreateArticleDto, CreateGallerieDto } from './dto/create-actualite.dto';
import { UpdateArticleDto } from './dto/update-actualite.dto';


@Controller('marketing-actualites')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createArticleDto: CreateArticleDto): Promise<ArticleActualite> {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  async findAll(): Promise<ArticleActualite[]> {
    return this.articlesService.findAll();
  }

  @Get("findByreference/:refSite")
  async findAllByrefSite(@Param('refSite') refSite: string): Promise<ArticleActualite[]> {
    return this.articlesService.findAllByrefSite(refSite);
  }

  @Get("incrementation-vue-actualite/:id")
  async onIncrement(@Param('id') id: string): Promise<Boolean> {
    return this.articlesService.onIncrementVueNbr(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ArticleActualite> {
    return this.articlesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleActualite> {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.articlesService.delete(id);
  }



  //////////////////////////    GESTION DE LA GALLERIE  ///////////////////////

  @Post("image-gallerie")
  @HttpCode(HttpStatus.CREATED)
  onCreateGallerie(@Body() gallerieDto: CreateGallerieDto): Promise<GallerieImage> {
    return this.articlesService.onCreateGallerie(gallerieDto);
  }

  @Get("image-gallerie/readAll")
  async onFindAllGallerie(): Promise<GallerieImage[]> {
    return this.articlesService.onfindAllGallerie();
  }


  @Delete('image-gallerie/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async onDeleteGallerie(@Param('id') id: string): Promise<void> {
    return this.articlesService.onDeleteGallerie(id);
  }


  @Get("image-for-mediatheque/readAll")
  async onFindAllImageForMediatheque(): Promise<GallerieImage[]> {
    return this.articlesService.onReadAllMediathequeImage();
  }


  @Post("image-mediatheque-ajout-retirer")
  @HttpCode(HttpStatus.CREATED)
  onCreateMediathequeImage(@Body("id") id: string, @Body("isMediathequeImage") isMediathequeImage: boolean, ): Promise<any> {
    return this.articlesService.onAjoutMediatheque(id, isMediathequeImage);
  }






  //////////////////////////    GESTION DE LA NEWSLETTER  ///////////////////////

  @Post("create-newsLetter")
  @HttpCode(HttpStatus.CREATED)
  onCreateNewsLetter(@Body("email") email: string): Promise<NewsLetteEmail> {
    return this.articlesService.onCreateNewsLetter(email);
  }

  @Get("news-letter/readAll")
  async onFindAllNewsLetter(): Promise<NewsLetteEmail[]> {
    return this.articlesService.onfindAllNewsLetter();
  }

  @Delete('delete-newsletter/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async onDeleteNewsLetter(@Param('id') id: string): Promise<void> {
    return this.articlesService.onDeleteNewsLetter(id);
  }

}

