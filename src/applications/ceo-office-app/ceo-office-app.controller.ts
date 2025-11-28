// src/travel-tickets/travel-tickets.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { TravelTicketsService } from './ceo-office-app.service';
import { CreateTravelTicketDto } from './dto/create-ceo-office-app.dto';
import { UpdateTravelTicketDto } from './dto/update-ceo-office-app.dto';


@Controller('travel-tickets')
export class TravelTicketsController {
  constructor(private readonly travelTicketsService: TravelTicketsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createTravelTicketDto: CreateTravelTicketDto) {
    return this.travelTicketsService.create(createTravelTicketDto);
  }

  @Get()
  findAll() {
    return this.travelTicketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.travelTicketsService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id') id: string, @Body() updateTravelTicketDto: UpdateTravelTicketDto) {
    return this.travelTicketsService.update(id, updateTravelTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.travelTicketsService.remove(id);
  }
}