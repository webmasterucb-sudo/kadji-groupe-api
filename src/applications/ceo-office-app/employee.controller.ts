import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  findAll(
    @Query('departement') departement?: string,
    @Query('statut') statut?: string,
    @Query('entreprise') entreprise?: string,
  ) {
    if (departement) {
      return this.employeeService.findByDepartement(departement);
    }
    if (statut) {
      return this.employeeService.findByStatut(statut);
    }
    if (entreprise) {
      return this.employeeService.findByEntreprise(entreprise);
    }
    return this.employeeService.findAll();
  }

  @Get('matricule/:matricule')
  findByMatricule(@Param('matricule') matricule: string) {
    return this.employeeService.findByMatricule(matricule);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}
