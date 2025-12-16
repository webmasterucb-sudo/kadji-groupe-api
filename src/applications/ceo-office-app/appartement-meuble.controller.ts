import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { CreateAppartementMeubleDto } from './dto/create-appartement-meuble.dto';
import { UpdateAppartementMeubleDto } from './dto/update-appartement-meuble.dto';
import { AppartementMeubleService } from './appartement-meuble.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';

@Controller('appartement-meuble')
@UseGuards(JwtAuthGuard)
export class AppartementMeubleController {
  constructor(
    private readonly appartementMeubleService: AppartementMeubleService,
  ) {}

  @Post()
  create(@Body() createAppartementMeubleDto: CreateAppartementMeubleDto) {
    return this.appartementMeubleService.create(createAppartementMeubleDto);
  }

  @Get()
  findAll() {
    return this.appartementMeubleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appartementMeubleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppartementMeubleDto: UpdateAppartementMeubleDto,
  ) {
    return this.appartementMeubleService.update(id, updateAppartementMeubleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appartementMeubleService.remove(id);
  }
}
