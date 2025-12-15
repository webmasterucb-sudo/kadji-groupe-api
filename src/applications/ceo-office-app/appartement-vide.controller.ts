import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { CreateAppartementVideDto } from './dto/create-appartement-vide.dto';
import { UpdateAppartementVideDto } from './dto/update-appartement-vide.dto';
import { AppartementVideService } from './appartement-vide.service';
import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';

@Controller('empty-apartments')
@UseGuards(JwtAuthGuard)
export class AppartementVideController {
    constructor(private readonly appartementVideService: AppartementVideService) { }

    @Post()
    create(@Body() createAppartementVideDto: CreateAppartementVideDto) {
        return this.appartementVideService.create(createAppartementVideDto);
    }

    @Get()
    findAll() {
        return this.appartementVideService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.appartementVideService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAppartementVideDto: UpdateAppartementVideDto) {
        return this.appartementVideService.update(id, updateAppartementVideDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.appartementVideService.remove(id);
    }
}
