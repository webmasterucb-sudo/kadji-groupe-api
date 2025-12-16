import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  // @IsNotEmpty()
  // nom: string;

  // @IsNotEmpty()
  // prenom: string;

  // @IsNotEmpty()
  // telephone: string;

  // @IsEmail()
  // @IsNotEmpty()
  // email: string;

  // @IsNotEmpty()
  // @MinLength(6)
  // password: string;

  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @IsString()
  nom: string;

  @IsNotEmpty({ message: 'Le prénom est obligatoire' })
  @IsString()
  prenom: string;

  @IsNotEmpty({ message: 'Le téléphone est obligatoire' })
  @IsString()
  telephone: string;

  @IsNotEmpty({ message: "L'email est obligatoire" })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  password: string;

  @IsNotEmpty({ message: 'Le rôle est obligatoire' })
  @IsString()
  role: string;

  @IsEnum(['ACTIVE', 'INACTIVE'], {
    message: 'Le statut doit être ACTIVE ou INACTIVE',
  })
  status: 'ACTIVE' | 'INACTIVE';
}
