import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateValidateurEmailDto {
  @IsNotEmpty({ message: "L'email est obligatoire" })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsNotEmpty({ message: "L'entreprise est obligatoire" })
  @IsString()
  entreprise: string;

  @IsNotEmpty({ message: 'Le statut est obligatoire' })
  @IsEnum(['ACTIVE', 'INACTIVE'], {
    message: 'Le statut doit être ACTIVE ou INACTIVE',
  })
  status: 'ACTIVE' | 'INACTIVE';
}
