import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { HotelApartementService } from './hotel-apartement.service';
import { CreateHotelApartementDto } from '../dto/create-hotel-apartement.dto';
import { UpdateHotelApartementDto } from '../dto/update-hotel-apartement.dto';

@Controller('public/hotel-apartements')
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
    @UsePipes(new ValidationPipe({ transform: true }))
    update(@Param('id') id: string, @Body() updateHotelApartementDto: UpdateHotelApartementDto) {
        return this.hotelApartementService.update(id, updateHotelApartementDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.hotelApartementService.remove(id);
    }

    @Post("aprouve-demande")
    onAprouve(@Body('id') id: string, @Body('isAprouve') isAprouve: boolean) {
        return this.hotelApartementService.onAprouveDemande(id, isAprouve);
    }
}



