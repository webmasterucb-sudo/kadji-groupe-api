import { IsString, IsNumber, IsEnum, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAppartementMeubleDto {
    @IsString()
    @IsOptional()
    bookingId: string;

    @IsString()
    @IsOptional()
    employeeName: string;

    @IsString()
    @IsOptional()
    employeeFirstName: string;

    @IsString()
    @IsOptional()
    employeeCompany: string;

    @IsString()
    @IsOptional()
    department: string;

    @IsString()
    @IsOptional()
    payerCompany: string;

    @IsNumber()
    @IsOptional()
    nightlyRate: number;

    @IsNumber()
    @IsOptional()
    totalAmount: number;

    @IsString()
    @IsOptional()
    currency: string;

    @IsString()
    @IsOptional()
    residenceName: string;

    @IsDateString()
    @IsOptional()
    checkInDate: string;

    @IsDateString()
    @IsOptional()
    checkOutDate: string;

    @IsNumber()
    @IsOptional()
    numberOfNights: number;

    @IsEnum(['CONFIRMED', 'PENDING', 'CANCELLED'])
    @IsOptional()
    status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
}
