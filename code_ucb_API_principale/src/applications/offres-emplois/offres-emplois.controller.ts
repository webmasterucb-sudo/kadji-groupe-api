// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { OffresEmploisService } from './offres-emplois.service';
// import { CreateOffresEmploisDto } from './dto/create-offres-emplois.dto';
// import { UpdateOffresEmploisDto } from './dto/update-offres-emplois.dto';

// @Controller('offres-emplois')
// export class OffresEmploisController {
//   constructor(private readonly offresEmploisService: OffresEmploisService) {}

//   @Post()
//   create(@Body() createOffresEmploisDto: CreateOffresEmploisDto) {
//     return this.offresEmploisService.create(createOffresEmploisDto);
//   }

//   @Get()
//   findAll() {
//     return this.offresEmploisService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.offresEmploisService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateOffresEmploisDto: UpdateOffresEmploisDto) {
//     return this.offresEmploisService.update(+id, updateOffresEmploisDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.offresEmploisService.remove(+id);
//   }
// }



// =====================================================
// 4. CONTROLLER (job-offers.controller.ts)
// =====================================================

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, ParseIntPipe, DefaultValuePipe, } from '@nestjs/common';
import { CreateJobOfferDto } from './dto/create-offres-emplois.dto';
import { UpdateJobOfferDto } from './dto/update-offres-emplois.dto';
import { JobOffersService } from './offres-emplois.service';


@Controller('offres-emplois-controller')
export class JobOffersController {
  constructor(private readonly jobOffersService: JobOffersService) {}

  @Post()
  async create(@Body() createJobOfferDto: CreateJobOfferDto) {
    const jobOffer = await this.jobOffersService.create(createJobOfferDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Offre d\'emploi créée avec succès',
      data: jobOffer,
    };
  }


  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('isActive') isActive?: string,
  ) {
    const isActiveFilter = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    const result = await this.jobOffersService.findAll(page, limit, isActiveFilter);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Offres d\'emploi récupérées avec succès',
      ...result,
    };
  }


  @Get('search')
  async searchByTitle(@Query('title') title: string) {
    const jobOffers = await this.jobOffersService.searchByTitle(title);
    return {
      statusCode: HttpStatus.OK,
      message: 'Recherche effectuée avec succès',
      data: jobOffers,
      count: jobOffers.length,
    };
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    const jobOffer = await this.jobOffersService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Offre d\'emploi trouvée',
      data: jobOffer,
    };
  }


  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateJobOfferDto: UpdateJobOfferDto,
  ) {
    const jobOffer = await this.jobOffersService.update(id, updateJobOfferDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Offre d\'emploi mise à jour avec succès',
      data: jobOffer,
    };
  }


  @Patch(':id/apply')
  async incrementApplicationCount(@Param('id') id: string) {
    const jobOffer = await this.jobOffersService.incrementApplicationCount(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Candidature enregistrée',
      data: jobOffer,
    };
  }


  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.jobOffersService.remove(id); 
    console.log("xxxxxxxxxxxxxxxxxxxx")
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  } 
 
}

