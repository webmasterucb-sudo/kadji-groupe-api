import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { CreateAppartementVideDto } from './dto/create-appartement-vide.dto';
import { UpdateAppartementVideDto } from './dto/update-appartement-vide.dto';
import { AppartementVideService } from './appartement-vide.service';


@Controller('empty-apartments')
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
