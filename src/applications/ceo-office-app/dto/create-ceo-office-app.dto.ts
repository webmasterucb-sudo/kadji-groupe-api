export class CreateCeoOfficeAppDto { }

// src/travel-tickets/dto/create-travel-ticket.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsDateString, Matches, Min, MinLength, IsDate, IsOptional } from 'class-validator';

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
  @IsNotEmpty()
  @Matches(/^[A-Z0-9]+$/, { message: 'Matricule must be alphanumeric uppercase' })
  matricule: string;

  @IsString()
  @IsNotEmpty()
  entreprise: string;

  @IsString()
  @IsNotEmpty()
  departement: string;

  @IsString()
  @IsNotEmpty()
  fonction: string;

  @IsString()
  @IsNotEmpty()
  motifVoyage: string;

  @IsString()
  devises: string;

  @IsNumber()
  @Min(0)
  prixBilletAvion: number;

  @IsString()
  classe: string;

  @IsString()
  @IsNotEmpty()
  projet: string;

  @IsString()
  @Matches(/^[A-Z]{3}$/, { message: 'Provenance code must be 3 uppercase letters' })
  provenanceCodeAeroport: string;

  @IsString()
  @Matches(/^[A-Z]{3}$/, { message: 'Destination code must be 3 uppercase letters' })
  destinationCodeAeroport: string;

  @IsDate()
  @IsNotEmpty()
  dateDepart: Date;

  @IsDate()
  @IsNotEmpty()
  dateRetour: Date;

  @IsDate()
  submittedAt: Date;

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  agenceVoyage: string;

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
