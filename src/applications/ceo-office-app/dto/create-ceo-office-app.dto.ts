export class CreateCeoOfficeAppDto {}

import { Prop } from '@nestjs/mongoose';
// src/travel-tickets/dto/create-travel-ticket.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  Matches,
  Min,
  MinLength,
  IsDate,
  IsOptional,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class CreateTravelTicketDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  nom: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  prenom: string;

  @IsString()
  @IsOptional()
  matricule: string;

  @IsString()
  @IsOptional()
  entreprise: string;

  @IsString()
  @IsOptional()
  departement: string;

  @IsString()
  @IsOptional()
  fonction: string;

  @IsString()
  @IsEmail()
  emailDemandeur: string;

  @IsString()
  @IsOptional()
  motifVoyage: string;

  @IsString()
  @IsOptional()
  devises: string;

  @IsNumber()
  @Min(0)
  prixBilletAvion: number;

  @IsString()
  @IsOptional()
  classe: string;

  @IsString()
  @IsOptional()
  projet: string;

  @IsString()
  @Matches(/^[A-Z]{3}$/, {
    message: 'Provenance code must be 3 uppercase letters',
  })
  provenanceCodeAeroport: string;

  @IsString()
  @Matches(/^[A-Z]{3}$/, {
    message: 'Destination code must be 3 uppercase letters',
  })
  destinationCodeAeroport: string;

  @IsString()
  @IsOptional()
  villeProvenance: string;

  @IsString()
  @IsOptional()
  villeDestination: string;

  @IsDate()
  @IsOptional()
  dateDepart: Date;

  @IsDate()
  @IsOptional()
  dateRetour: Date;

  @IsDate()
  submittedAt: Date;

  @IsNumber()
  coutAdditionnel: number;

  @IsString()
  motifCoutAdditionnel: string;

  @IsString()
  @IsOptional()
  adminEmail: string;

  @IsBoolean()
  @IsOptional()
  isDemandeurData: boolean;

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  agenceVoyage: string;

  @IsString()
  @IsOptional()
  emailValidateur: string;

  @IsDate()
  approvedAt: Date;

  @IsString()
  approvedById: string;
}

// export interface HotelApartementDTO {
//   id?: string;

//   hotelName: string;
//   nomOccupant: string;
//   prenomOccupant: string;
//   nightlyRate: number;
//   numberOfNights: number;
//   breakfastAmount: number;
//   lunchAmount: number;
//   dinnerAmount: number;
//   extrasDescription?: string;
//   extrasAmount: number;
//   checkInDate: string;
//   checkOutDate: string;
//   totalAmount?: number;
//   currency?: string;
//   status?: 'RESERVE' | 'CONFIRME' | 'ANNULE' | 'FACTURE';
//   notes?: string;

//   createdById?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }
