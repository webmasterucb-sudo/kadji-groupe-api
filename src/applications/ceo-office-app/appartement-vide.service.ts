import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppartementVide, AppartementVideDocument } from './entities/appartement-vide.entity';
import { CreateAppartementVideDto } from './dto/create-appartement-vide.dto';
import { UpdateAppartementVideDto } from './dto/update-appartement-vide.dto';

@Injectable()
export class AppartementVideService {
    constructor(
        @InjectModel(AppartementVide.name) private appartementVideModel: Model<AppartementVideDocument>,
    ) { }

    async create(createAppartementVideDto: CreateAppartementVideDto): Promise<AppartementVide> {
        const createdAppartementVide = new this.appartementVideModel(createAppartementVideDto);
        return createdAppartementVide.save();
    }

    async findAll(): Promise<AppartementVide[]> {
        return this.appartementVideModel.find().sort({ updatedAt: -1 }).exec();
    }

    async findOne(id: string): Promise<AppartementVide> {
        const appartementVide = await this.appartementVideModel.findById(id).exec();
        if (!appartementVide) {
            throw new NotFoundException(`AppartementVide with ID ${id} not found`);
        }
        return appartementVide;
    }

    async update(id: string, updateAppartementVideDto: UpdateAppartementVideDto): Promise<AppartementVide> {
        const updatedAppartementVide = await this.appartementVideModel
            .findByIdAndUpdate(id, updateAppartementVideDto, { new: true })
            .exec();
        if (!updatedAppartementVide) {
            throw new NotFoundException(`AppartementVide with ID ${id} not found`);
        }
        return updatedAppartementVide;
    }

    async remove(id: string): Promise<AppartementVide> {
        const deletedAppartementVide = await this.appartementVideModel.findByIdAndDelete(id).exec();
        if (!deletedAppartementVide) {
            throw new NotFoundException(`AppartementVide with ID ${id} not found`);
        }
        return deletedAppartementVide;
    }
}
