import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FournisseurBilletService } from './fournisseur-billet.service';
import { CreateFournisseurBilletDto } from './dto/create-fournisseur-billet.dto';
import { UpdateFournisseurBilletDto } from './dto/update-fournisseur-billet.dto';

@Controller('fournisseurs-billets')
export class FournisseurBilletController {
    constructor(private readonly fournisseurBilletService: FournisseurBilletService) { }

    @Post()
    create(@Body() createDto: CreateFournisseurBilletDto) {
        return this.fournisseurBilletService.create(createDto);
    }

    @Get()
    findAll() {
        return this.fournisseurBilletService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.fournisseurBilletService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateFournisseurBilletDto) {
        return this.fournisseurBilletService.update(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.fournisseurBilletService.remove(id);
    }
}



