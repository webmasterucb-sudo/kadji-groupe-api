import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    HotelApartement,
    HotelApartementDocument,
} from './entities/hotel-apartement.entity';
import { CreateHotelApartementDto } from './dto/create-hotel-apartement.dto';
import { UpdateHotelApartementDto } from './dto/update-hotel-apartement.dto';

@Injectable()
export class HotelApartementService {
    constructor(
        @InjectModel(HotelApartement.name)
        private hotelApartementModel: Model<HotelApartementDocument>,
    ) { }

    async create(
        createHotelApartementDto: CreateHotelApartementDto,
    ): Promise<HotelApartement> {
        const createdHotelApartement = new this.hotelApartementModel(
            createHotelApartementDto,
        );
        return createdHotelApartement.save();
    }

    async findAll(): Promise<HotelApartement[]> {
        return this.hotelApartementModel.find().sort({ updatedAt: -1 }).limit(1200).exec();
    }

    async findOne(id: string): Promise<HotelApartement> {
        const hotelApartement = await this.hotelApartementModel.findById(id).exec();
        if (!hotelApartement) {
            throw new NotFoundException(`HotelApartement with ID ${id} not found`);
        }
        return hotelApartement;
    }

    async update(
        id: string,
        updateHotelApartementDto: UpdateHotelApartementDto,
    ): Promise<HotelApartement> {
        const updatedHotelApartement = await this.hotelApartementModel
            .findByIdAndUpdate(id, updateHotelApartementDto, { new: true })
            .exec();
        if (!updatedHotelApartement) {
            throw new NotFoundException(`HotelApartement with ID ${id} not found`);
        }
        return updatedHotelApartement;
    }

    async remove(id: string): Promise<HotelApartement> {
        const deletedHotelApartement = await this.hotelApartementModel
            .findByIdAndDelete(id)
            .exec();
        if (!deletedHotelApartement) {
            throw new NotFoundException(`HotelApartement with ID ${id} not found`);
        }
        return deletedHotelApartement;
    }
}
