import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { HotelParametreService } from './hotel-parametre.service';
import { CreateHotelParametreDto } from './dto/create-hotel-parametre.dto';
import { UpdateHotelParametreDto } from './dto/update-hotel-parametre.dto';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';

@Controller('hotels-parametres')
@UseGuards(JwtAuthGuard)
export class HotelParametreController {
    constructor(private readonly hotelParametreService: HotelParametreService) { }

    @Post()
    create(@Body() createDto: CreateHotelParametreDto) {
        return this.hotelParametreService.create(createDto);
    }

    @Get()
    findAll() {
        return this.hotelParametreService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.hotelParametreService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateHotelParametreDto) {
        return this.hotelParametreService.update(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.hotelParametreService.remove(id);
    }
}
