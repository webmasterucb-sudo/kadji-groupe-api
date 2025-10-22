import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  IsBoolean,
  IsMongoId,
} from 'class-validator';

export class CreateBienImmoDto {
 
  @IsOptional()
  @IsString()
  photoLink?: string;

 
  @IsString()
  @IsNotEmpty()
  designation: string;

 
  @IsOptional()
  @IsString()
  reference?: string;

 
  @IsOptional()
  @IsString()
  numeroSerie?: string;

 
  @IsOptional()
  @IsString()
  fournisseur?: string;

 
  @IsDateString()
  dateAcquisition: Date;

 
  @IsString()
  @IsNotEmpty()
  codeSAP: string;

 
  @IsString()
  @IsNotEmpty()
  numeroInventaire: string;

 
  @IsOptional()
  @IsDateString()
  dateDernierInventaire?: Date;

 
  @IsString()
  @IsNotEmpty()
  serviceAffectation: string;
  
 
  @IsString()
  @IsNotEmpty()
  siteAffectation: string;

 
  @IsString()
  @IsNotEmpty()
  responsable: string;

 
  @IsString()
  @IsNotEmpty()
  emplacement1: string;


  @IsOptional()
  @IsString()
  emplacement2?: string;

 
  @IsOptional()
  @IsString()
  utilisateur?: string;


  @IsNumber()
  valeurAcquisition: number;

 
  @IsString()
  @IsNotEmpty()
  etatImmo: string;

 
  @IsString()
  @IsNotEmpty()
  compteBilan: string;

  
  @IsNumber()
  valeurOrigine: number;

 
  @IsNumber()
  valeurResiduelle: number;

 
  @IsNumber()
  dureeVie: number;

 
  @IsDateString()
  dateFinAmortissement: Date;

  
  @IsOptional()
  @IsString()
  description?: string;

 
  @IsOptional()
  @IsString()
  observation?: string;
  
 
  @IsString()
  @IsNotEmpty()
  libelleCompte: string;

 
  @IsOptional()
  @IsNumber()
  geoPositionDX?: number;

 
  @IsOptional()
  @IsNumber()
  geoPositionDY?: number;

 
  @IsOptional()
  @IsString()
  codeEmplacement?: string;

  
  @IsOptional()
  @IsBoolean()
  isImmoScan?: boolean;

 
  @IsOptional()
  @IsMongoId({ each: true })
  collecteurImmoID?: string;

  
  @IsOptional()
  @IsMongoId({ each: true })
  controleurImmoID?: string;
  
 
  @IsOptional()
  @IsString()
  statutImmo?: string;

 
  @IsOptional()
  @IsBoolean()
  isImmoControle?: boolean;

  
  @IsOptional()
  @IsString()
  localisationImmoRef?: string;
  

  @IsOptional()
  @IsDateString()
  dateScan?: Date;

 
  @IsOptional()
  @IsDateString()
  dateControle?: Date;

  
}
