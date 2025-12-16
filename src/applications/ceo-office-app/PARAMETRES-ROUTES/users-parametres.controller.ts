import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UsersParametresService } from './users-parametres.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CheckEmailDto } from './dto/check-email.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';

@Controller('gestion-administrateurs')
@UseGuards(JwtAuthGuard)
export class UsersParametresController {
  constructor(private readonly usersService: UsersParametresService) {}

  /**
   * GET /api/users
   * Récupérer tous les utilisateurs
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers() {
    try {
      const users = await this.usersService.findAll();
      return {
        success: true,
        data: users,
        message: 'Utilisateurs récupérés avec succès',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * GET /api/users/:id
   * Récupérer un utilisateur par ID
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(id);
      return {
        success: true,
        data: user,
        message: 'Utilisateur récupéré avec succès',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * POST /api/users
   * Créer un nouvel utilisateur
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return {
        success: true,
        data: user,
        message: 'Utilisateur créé avec succès',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * PUT /api/users/:id
   * Mettre à jour un utilisateur
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this.usersService.update(id, updateUserDto);
      return {
        success: true,
        data: user,
        message: 'Utilisateur mis à jour avec succès',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * DELETE /api/users/:id
   * Supprimer un utilisateur
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string) {
    try {
      const result = await this.usersService.remove(id);
      return {
        success: true,
        data: result,
        message: 'Utilisateur supprimé avec succès',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * POST /api/users/check-email
   * Vérifier si un email existe déjà
   */
  @Post('check-email')
  @HttpCode(HttpStatus.OK)
  async checkEmailExists(@Body() checkEmailDto: CheckEmailDto) {
    try {
      const exists = await this.usersService.checkEmailExists(
        checkEmailDto.email,
      );
      return {
        success: true,
        data: exists,
        message: exists ? 'Email déjà utilisé' : 'Email disponible',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * POST /api/gestion-administrateurs/verify-user
   * Vérifier les identifiants d'un utilisateur
   */
  @Post('verify-user')
  @HttpCode(HttpStatus.OK)
  async verifyUser(@Body() verifyUserDto: VerifyUserDto) {
    try {
      const isValid = await this.usersService.verifyCredentials(
        verifyUserDto.email,
        verifyUserDto.password,
      );
      return {
        success: true,
        data: isValid,
        message: isValid ? 'Utilisateur vérifié' : 'Identifiants invalides',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
