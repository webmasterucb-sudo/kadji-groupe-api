import { IsString, IsNumber, IsEnum, IsDateString, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAppartementVideDto {
    @IsString()
    @IsNotEmpty()
    employeeName: string;

    @IsString()
    @IsNotEmpty()
    employeeCompany: string;

    @IsString()
    @IsNotEmpty()
    department: string;

    @IsString()
    @IsNotEmpty()
    payerCompany: string;

    @IsNumber()
    @IsNotEmpty()
    monthlyRent: number;

    @IsNumber()
    @IsNotEmpty()
    securityDeposit: number;

    @IsString()
    @IsNotEmpty()
    currency: string;

    @IsString()
    @IsNotEmpty()
    residenceName: string;

    @IsEnum(['STUDIO', '2CHAM', '3CHAM', '4CHAM'])
    @IsNotEmpty()
    apartmentType: 'STUDIO' | '2CHAM' | '3CHAM' | '4CHAM';

    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    endDate: string;

    @IsBoolean()
    @IsNotEmpty()
    isRenewAlertActive: boolean;

    @IsNumber()
    @IsNotEmpty()
    daysRemaining: number;

    @IsEnum(['RESERVE', 'CONFIRME', 'ANNULE', 'FACTURE', 'PAYE'])
    @IsOptional()
    status?: 'RESERVE' | 'CONFIRME' | 'ANNULE' | 'FACTURE' | 'PAYE';

    @IsString()
    @IsOptional()
    notes?: string;
}

