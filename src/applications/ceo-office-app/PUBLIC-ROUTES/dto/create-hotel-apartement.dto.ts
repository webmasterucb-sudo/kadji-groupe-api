import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class CreateHotelApartementDto {
    @IsString()
    @IsNotEmpty()
    hotelName: string;

    @IsString()
    @IsNotEmpty()
    nomOccupant: string;

    @IsString()
    @IsNotEmpty()
    prenomOccupant: string;

    @IsString()
    @IsOptional()
    entrepriseOccupant?: string;

    @IsString()
    @IsOptional()
    entreprisePayante?: string;

    @IsNumber()
    @IsOptional()
    nightlyRate?: number;

    @IsNumber()
    @IsOptional()
    numberOfNights?: number;

    @IsNumber()
    @IsOptional()
    breakfastAmount?: number;

    @IsNumber()
    @IsOptional()
    lunchAmount?: number;

    @IsNumber()
    @IsOptional()
    dinnerAmount?: number;

    @IsString()
    @IsOptional()
    extrasDescription?: string;

    @IsNumber()
    @IsOptional()
    extrasAmount?: number;

    @IsString()
    @IsOptional()
    checkInDate?: string;

    @IsString()
    @IsOptional()
    checkOutDate?: string;

    @IsNumber()
    @IsOptional()
    totalAmount?: number;

    @IsString()
    @IsOptional()
    currency?: string;

    @IsString()
    @IsEnum(['RESERVE', 'CONFIRME', 'ANNULE', 'FACTURE'])
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsString()
    @IsOptional()
    emailValidateur?: string;

    @IsString()
    @IsOptional()
    createdById?: string;
}
