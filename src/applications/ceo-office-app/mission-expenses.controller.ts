import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { MissionExpensesService } from './mission-expenses.service';
import { CreateMissionExpenseDto } from './dto/create-mission-expense.dto';
import { UpdateMissionExpenseDto } from './dto/update-mission-expense.dto';

@Controller('mission-expenses')
@UseGuards(JwtAuthGuard)
export class MissionExpensesController {
    constructor(private readonly missionExpensesService: MissionExpensesService) { }

    @Post()
    create(@Body() createMissionExpenseDto: CreateMissionExpenseDto) {
        return this.missionExpensesService.create(createMissionExpenseDto);
    }

    @Get()
    findAll() {
        return this.missionExpensesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.missionExpensesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateMissionExpenseDto: UpdateMissionExpenseDto) {
        return this.missionExpensesService.update(id, updateMissionExpenseDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.missionExpensesService.remove(id);
    }
}
