import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode,  HttpStatus, } from '@nestjs/common';
import { FormulairesService } from './formulaires.service';
import { ContactFormDto } from './dto/create-formulaire.dto';
import { UpdateFormulaireDto } from './dto/update-formulaire.dto';

@Controller('formulaires-contact')
export class FormulairesController {
  constructor(private readonly formulairesService: FormulairesService) {}

  @Post()
   @HttpCode(HttpStatus.CREATED)
   create(@Body() contactFormData: ContactFormDto) {
     console.log("Formulaire DTO", contactFormData);
    return this.formulairesService.create(contactFormData);
  }

  @Get()
  findAll() {
    return this.formulairesService.findAll(); 
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formulairesService.findOne(+id);  
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFormulaireDto: UpdateFormulaireDto) {
    return this.formulairesService.update(+id, updateFormulaireDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formulairesService.remove(+id);
  }
}
   
 