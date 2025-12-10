import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateHotelParametreDto {
    @IsNotEmpty({ message: 'Le nom de l\'hôtel est obligatoire' })
    @IsString()
    nom: string;

    @IsNotEmpty({ message: 'L\'adresse est obligatoire' })
    @IsString()
    address: string;

    @IsNotEmpty({ message: 'Le statut est obligatoire' })
    @IsEnum(['ACTIVE', 'INACTIVE'], { message: 'Le statut doit être ACTIVE ou INACTIVE' })
    status: 'ACTIVE' | 'INACTIVE';
}
