import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    MissionExpense,
    MissionExpenseDocument,
} from './entities/mission-expense.entity';
import { CreateMissionExpenseDto } from './dto/create-mission-expense.dto';
import { UpdateMissionExpenseDto } from './dto/update-mission-expense.dto';

@Injectable()
export class MissionExpensesService {
    constructor(
        @InjectModel(MissionExpense.name)
        private missionExpenseModel: Model<MissionExpenseDocument>,
    ) { }

    async create(
        createMissionExpenseDto: CreateMissionExpenseDto,
    ): Promise<MissionExpense> {
        const createdMissionExpense = new this.missionExpenseModel(
            createMissionExpenseDto,
        );
        return createdMissionExpense.save();
    }

    async findAll(): Promise<MissionExpense[]> {
        return this.missionExpenseModel.find().sort({ updatedAt: -1 }).limit(1200).exec();
    }

    async findOne(id: string): Promise<MissionExpense> {
        const missionExpense = await this.missionExpenseModel.findById(id).exec();
        if (!missionExpense) {
            throw new NotFoundException(`MissionExpense with ID ${id} not found`);
        }
        return missionExpense;
    }

    async update(
        id: string,
        updateMissionExpenseDto: UpdateMissionExpenseDto,
    ): Promise<MissionExpense> {
        const updatedMissionExpense = await this.missionExpenseModel
            .findByIdAndUpdate(id, updateMissionExpenseDto, { new: true })
            .exec();
        if (!updatedMissionExpense) {
            throw new NotFoundException(`MissionExpense with ID ${id} not found`);
        }
        return updatedMissionExpense;
    }

    async remove(id: string): Promise<MissionExpense> {
        const deletedMissionExpense = await this.missionExpenseModel
            .findByIdAndDelete(id)
            .exec();
        if (!deletedMissionExpense) {
            throw new NotFoundException(`MissionExpense with ID ${id} not found`);
        }
        return deletedMissionExpense;
    }
}
