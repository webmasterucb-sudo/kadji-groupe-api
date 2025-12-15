import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HotelApartementService } from './hotel-apartement.service';
import { CreateHotelApartementDto } from './dto/create-hotel-apartement.dto';
import { UpdateHotelApartementDto } from './dto/update-hotel-apartement.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';

@Controller('hotel-apartements')
@UseGuards(JwtAuthGuard)
export class HotelApartementController {
    constructor(private readonly hotelApartementService: HotelApartementService) { }

    @Post()
    create(@Body() createHotelApartementDto: CreateHotelApartementDto) {
        return this.hotelApartementService.create(createHotelApartementDto);
    }

    @Get()
    findAll() {
        return this.hotelApartementService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.hotelApartementService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateHotelApartementDto: UpdateHotelApartementDto) {
        return this.hotelApartementService.update(id, updateHotelApartementDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.hotelApartementService.remove(id);
    }
}
