import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTravelTicketPublicDto } from './dto/create-travel-ticket-public.dto';
import { UpdateTravelTicketPublicDto } from './dto/update-travel-ticket-public.dto';
import { TravelTicket } from '../entities/ceo-office-app.entity';

@Injectable()
export class TravelTicketPublicService {
    constructor(
        @InjectModel(TravelTicket.name) private travelTicketPublicModel: Model<TravelTicket>,
    ) { }

    async create(createTravelTicketPublicDto: CreateTravelTicketPublicDto): Promise<TravelTicket> {
        const createdTicket = new this.travelTicketPublicModel(createTravelTicketPublicDto);
        let data = await createdTicket.save();
        return data;
    }

    async findAll(): Promise<TravelTicket[]> {
        let data = await this.travelTicketPublicModel.find().exec();
        return data;
    }

    async findOne(id: string): Promise<TravelTicket | null> {
        let data = await this.travelTicketPublicModel.findById(id).exec();
        return data;
    }

    async update(id: string, updateTravelTicketPublicDto: UpdateTravelTicketPublicDto): Promise<TravelTicket | null> {
        let data = await this.travelTicketPublicModel.findByIdAndUpdate(id, updateTravelTicketPublicDto, { new: true }).exec();
        return data;
    }

    async remove(id: string): Promise<TravelTicket | null> {
        let data = await this.travelTicketPublicModel.findByIdAndDelete(id).exec();
        return data;
    }
}
