import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TravelTicketPublicService } from './travel-ticket-public.service';
import { CreateTravelTicketDto } from '../dto/create-ceo-office-app.dto';
import { UpdateTravelTicketDto } from '../dto/update-ceo-office-app.dto';

@Controller('public/travel-tickets')
export class TravelTicketPublicController {
  constructor(
    private readonly travelTicketPublicService: TravelTicketPublicService,
  ) {}

  @Post()
  // @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createTravelTicketDto: CreateTravelTicketDto) {
    return this.travelTicketPublicService.create(createTravelTicketDto);
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
  update(
    @Param('id') id: string,
    @Body() updateTravelTicketDto: UpdateTravelTicketDto,
  ) {
    return this.travelTicketPublicService.update(id, updateTravelTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.travelTicketPublicService.remove(id);
  }

  @Post('aprouve-demande')
  onAprouve(@Body('id') id: string, @Body('isAprouve') isAprouve: boolean) {
    return this.travelTicketPublicService.onAprouveDemande(id, isAprouve);
  }
}
