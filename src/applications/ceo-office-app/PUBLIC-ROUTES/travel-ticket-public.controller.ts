import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { TravelTicketPublicService } from './travel-ticket-public.service';
import { CreateTravelTicketPublicDto } from './dto/create-travel-ticket-public.dto';
import { UpdateTravelTicketPublicDto } from './dto/update-travel-ticket-public.dto';

@Controller('public/travel-tickets')
export class TravelTicketPublicController {
    constructor(private readonly travelTicketPublicService: TravelTicketPublicService) { }

    @Post()
    // @UsePipes(new ValidationPipe({ transform: true }))
    create(@Body() createTravelTicketPublicDto: CreateTravelTicketPublicDto) {
        return this.travelTicketPublicService.create(createTravelTicketPublicDto);
    }

    @Get()
    findAll() {
        return this.travelTicketPublicService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.travelTicketPublicService.findOne(id);
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
    update(@Param('id') id: string, @Body() updateTravelTicketPublicDto: UpdateTravelTicketPublicDto) {
        return this.travelTicketPublicService.update(id, updateTravelTicketPublicDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.travelTicketPublicService.remove(id);
    }
}
