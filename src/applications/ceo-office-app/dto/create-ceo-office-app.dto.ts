export class CreateCeoOfficeAppDto { }

// src/travel-tickets/dto/create-travel-ticket.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsDateString, Matches, Min, MinLength } from 'class-validator';

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

  @IsNumber()
  @Min(0)
  prixBilletAvion: number;

  @IsString()
  @IsNotEmpty()
  classe: string;

  @IsString()
  @IsNotEmpty()
  projet: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{3}$/, { message: 'Provenance code must be 3 uppercase letters' })
  provenanceCodeAeroport: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{3}$/, { message: 'Destination code must be 3 uppercase letters' })
  destinationCodeAeroport: string;

  @IsDateString()
  @IsNotEmpty()
  dateDepart: string;

  @IsDateString()
  @IsNotEmpty()
  dateRetour: string;
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
