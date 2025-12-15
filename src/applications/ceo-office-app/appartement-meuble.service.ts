import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppartementMeuble, AppartementMeubleDocument } from './entities/appartement-meuble.entity';
import { CreateAppartementMeubleDto } from './dto/create-appartement-meuble.dto';
import { UpdateAppartementMeubleDto } from './dto/update-appartement-meuble.dto';

@Injectable()
export class AppartementMeubleService {
    constructor(
        @InjectModel(AppartementMeuble.name) private appartementMeubleModel: Model<AppartementMeubleDocument>,
    ) { }

    async create(createAppartementMeubleDto: CreateAppartementMeubleDto): Promise<AppartementMeuble> {
        const createdAppartementMeuble = new this.appartementMeubleModel(createAppartementMeubleDto);
        return createdAppartementMeuble.save();
    }

    async findAll(): Promise<AppartementMeuble[]> {
        return this.appartementMeubleModel.find().sort({ updatedAt: -1 }).exec();
    }

    async findOne(id: string): Promise<AppartementMeuble> {
        const appartementMeuble = await this.appartementMeubleModel.findById(id).exec();
        if (!appartementMeuble) {
            throw new NotFoundException(`AppartementMeuble with ID ${id} not found`);
        }
        return appartementMeuble;
    }

    async update(id: string, updateAppartementMeubleDto: UpdateAppartementMeubleDto): Promise<AppartementMeuble> {
        const updatedAppartementMeuble = await this.appartementMeubleModel
            .findByIdAndUpdate(id, updateAppartementMeubleDto, { new: true })
            .exec();
        if (!updatedAppartementMeuble) {
            throw new NotFoundException(`AppartementMeuble with ID ${id} not found`);
        }
        return updatedAppartementMeuble;
    }

    async remove(id: string): Promise<AppartementMeuble> {
        const deletedAppartementMeuble = await this.appartementMeubleModel.findByIdAndDelete(id).exec();
        if (!deletedAppartementMeuble) {
            throw new NotFoundException(`AppartementMeuble with ID ${id} not found`);
        }
        return deletedAppartementMeuble;
    }
}
