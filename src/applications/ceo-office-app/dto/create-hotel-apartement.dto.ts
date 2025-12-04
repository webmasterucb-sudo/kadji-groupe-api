import { IsString, IsNumber, IsEnum, IsOptional, IsDateString } from 'class-validator';

export class CreateHotelApartementDto {
    @IsString()
    hotelName: string;

    @IsString()
    nomOccupant: string;

    @IsString()
    prenomOccupant: string;

    @IsString()
    @IsOptional()
    entrepriseOccupant?: string;

    @IsString()
    @IsOptional()
    entreprisePayante?: string;

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






// export interface AppartementMeubleDTO {
 
//   bookingId: string; 
//   employeeName: string;
//   employeeFirstName: string;
//   employeeCompany: string;     
//   department: string;          

//   payerCompany: string;        
//   nightlyRate: number;         
//   totalAmount: number;         
//   currency: string;

//   residenceName: string;       
//   checkInDate: string;         
//   checkOutDate: string;        
//   numberOfNights: number;
  
//   status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
// }




// export interface AppartementVideDTO {
//   id: string; 
 
//   employeeName: string;
//   employeeCompany: string;
//   department: string;
//   payerCompany: string;         
//   monthlyRent: number;          
//   securityDeposit: number;      
//   currency: string;             
//   residenceName: string;
//   apartmentType: 'STUDIO' | '2CHAM' | '3CHAM' | '4CHAM';

//   startDate: string;            
//   endDate: string;              
  
//   isRenewAlertActive: boolean;  
//   daysRemaining: number; 
// }
