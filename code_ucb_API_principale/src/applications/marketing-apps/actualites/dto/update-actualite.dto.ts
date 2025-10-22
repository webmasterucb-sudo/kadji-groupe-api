import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-actualite.dto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
