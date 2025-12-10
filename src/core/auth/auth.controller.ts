import { Controller, Post, Body, UsePipes, ValidationPipe, Get, UseGuards, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('auth-administrateurs')
export class AuthController {
    constructor(private authService: AuthService, private usersService: UsersService) { }

    @Post('login')
    @UsePipes(new ValidationPipe({ transform: true }))
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    @UsePipes(new ValidationPipe({ transform: true }))
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }


    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Body() req) {
        return req.user;
    }

    @Delete('delete-user')
    @UseGuards(JwtAuthGuard)
    onDeleteUser(@Body() req) {
        return this.authService.deleteUser(req.user.id);
    }


    @Post('change-statut-compte')
    @UseGuards(JwtAuthGuard)
    onChangeStatutCompte(@Body() req) {
        return this.usersService.onChangeStatutCompte(req.user.id, req.statutCompte);
    }

    @Post('update-user')
    @UseGuards(JwtAuthGuard)
    onUpdateUser(@Body() req) {
        return this.usersService.updateOne(req.user.id, req);
    }


}
