import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ValidateurEmailService } from './validateur-email.service';
import { CreateValidateurEmailDto } from './dto/create-validateur-email.dto';
import { UpdateValidateurEmailDto } from './dto/update-validateur-email.dto';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';

@Controller('validateurs-emails')
@UseGuards(JwtAuthGuard)
export class ValidateurEmailController {
  constructor(
    private readonly validateurEmailService: ValidateurEmailService,
  ) {}

  @Post()
  create(@Body() createDto: CreateValidateurEmailDto) {
    console.log(createDto);
    return this.validateurEmailService.create(createDto);
  }

  @Get()
  findAll() {
    return this.validateurEmailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.validateurEmailService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateValidateurEmailDto) {
    return this.validateurEmailService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.validateurEmailService.remove(id);
  }
}
