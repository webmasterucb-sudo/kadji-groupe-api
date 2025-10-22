import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OffreEmploisService } from './offre-emplois.service';
import { CreateOffreEmploisDto } from './dto/create-offre-emplois.dto';
import { UpdateOffreEmploisDto } from './dto/update-offre-emplois.dto';

@Controller('offre-emplois')
export class OffreEmploisController {
  constructor(private readonly offreEmploisService: OffreEmploisService) {}

  @Post()
  create(@Body() createOffreEmploisDto: CreateOffreEmploisDto) {
    return this.offreEmploisService.create(createOffreEmploisDto);
  }

  @Get()
  findAll() {
    return this.offreEmploisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offreEmploisService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOffreEmploisDto: UpdateOffreEmploisDto) {
    return this.offreEmploisService.update(+id, updateOffreEmploisDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offreEmploisService.remove(+id);
  }
}
