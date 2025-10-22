import { IsString, IsNotEmpty, MinLength, MaxLength, IsUrl, IsEnum, isNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsUrl({}, { message: 'Le lien de l\'image doit être un URL valide' })
  @IsNotEmpty({ message: 'Le lien de l\'image est requis' })
  imageLink: string;

  @IsString()
  @IsNotEmpty({ message: 'Le titre est requis' })
  @MinLength(5, { message: 'Le titre doit contenir au moins 5 caractères' })
  @MaxLength(500, { message: 'Le titre ne peut pas dépasser 500 caractères' })
  titre: string;

  @IsString()
  @IsNotEmpty({ message: 'La description est requise' })
  @MinLength(50, { message: 'La description doit contenir au moins 50 caractères' })
  @MaxLength(6000, { message: 'La description ne peut pas dépasser 6000 caractères' })
  description: string; 

//   @IsEnum(['Technologie', 'Santé', 'Éducation', 'Sport', 'Culture'], { message: 'Catégorie invalide' })
  @IsNotEmpty({ message: 'La catégorie est requise' })
  categorie: string;

//   @IsEnum(['Site A', 'Site B', 'Site C'], { message: 'Site de référence invalide' })
  @IsNotEmpty({ message: 'Le site de référence est requis' })
  refSite: string;

  @IsEnum(['Public', 'Privé', 'Brouillon'], { message: 'Statut de visibilité invalide' })
  @IsNotEmpty({ message: 'Le statut de visibilité est requis' })
  statutVisibility: string;

  @IsEnum(['principal', 'secondaire', 'brouillon'], { message: 'Type d\'article invalide' })
  @IsNotEmpty({ message: 'Le type d\'article est requis' })
  typeArticle: string;

}



export class CreateGallerieDto {
   @IsNotEmpty({ message: 'Le titre est requis' })
   imageLink: string; 
   isMediathequeImage: boolean;
   size: number;
}
