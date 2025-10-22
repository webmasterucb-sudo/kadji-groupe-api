import { Controller, Get, Post, Body, Patch, Param,  Delete } from '@nestjs/common';
import { CreateBienImmoDto } from './dto/bienImmo.dto';
import { BiensImmoService } from './immobilisation-service';
import { UpdateBienImmoDto } from './dto/update-finance-app.dto';



@Controller('biens-immobilisation') // Définit la route de base : /biens-immobilisation
export class BiensImmoController {
  constructor(private readonly biensService: BiensImmoService) {}

  @Post()
  create(@Body() createBienImmoDto: CreateBienImmoDto) {
    return this.biensService.create(createBienImmoDto);
  }

  @Get()
  findAll() {
    return this.biensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // ParseMongoIdPipe valide que l'ID est un ID MongoDB valide
    return this.biensService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBienImmoDto: UpdateBienImmoDto,
  ) {
    return this.biensService.update(id, updateBienImmoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.biensService.remove(id);
  }

  
}

