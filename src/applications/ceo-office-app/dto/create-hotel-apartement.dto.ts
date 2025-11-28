import { IsString, IsNumber, IsEnum, IsOptional, IsDateString } from 'class-validator';

export class CreateHotelApartementDto {
    @IsString()
    hotelName: string;

    @IsString()
    nomOccupant: string;

    @IsString()
    prenomOccupant: string;

    @IsNumber()
    nightlyRate: number;

    @IsNumber()
    numberOfNights: number;

    @IsNumber()
    breakfastAmount: number;

    @IsNumber()
    lunchAmount: number;

    @IsNumber()
    dinnerAmount: number;

    @IsString()
    @IsOptional()
    extrasDescription?: string;

    @IsNumber()
    extrasAmount: number;

    @IsDateString()
    checkInDate: string;

    @IsDateString()
    checkOutDate: string;

    @IsNumber()
    @IsOptional()
    totalAmount?: number;

    @IsString()
    @IsOptional()
    currency?: string;

    @IsEnum(['RESERVE', 'CONFIRME', 'ANNULE', 'FACTURE'])
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsString()
    @IsOptional()
    createdById?: string;
}
