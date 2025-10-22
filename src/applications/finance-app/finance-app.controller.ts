import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { FinanceAppService } from './finance-app.service';
import { CreateUsersDto } from './dto/create-finance-app.dto';
import { UpdateUserAppDto } from './dto/update-finance-app.dto';

@Controller('finance-app')
export class FinanceAppController {
  constructor(private readonly financeAppService: FinanceAppService) {}

  @Post()
  create(@Body() createFinanceAppDto: CreateUsersDto) {
    return this.financeAppService.onCreateUser(createFinanceAppDto);
  }

  @Get()
  findAll() {
    return this.financeAppService.findAllUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financeAppService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFinanceAppDto: UpdateUserAppDto) {
    return this.financeAppService.onUpdateUser(id, updateFinanceAppDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financeAppService.onDeleteUser(id);
  }
}
