// src/travel-tickets/travel-tickets.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTravelTicketDto } from './dto/create-ceo-office-app.dto';
import { UpdateTravelTicketDto } from './dto/update-ceo-office-app.dto';
import { TravelTicket } from './entities/ceo-office-app.entity';


@Injectable()
export class TravelTicketsService {
  constructor(@InjectModel(TravelTicket.name) private travelTicketModel: Model<TravelTicket>) {}

  async create(createTravelTicketDto: CreateTravelTicketDto): Promise<TravelTicket> {
    const createdTicket = new this.travelTicketModel(createTravelTicketDto);
    return createdTicket.save();
  }

  async findAll(): Promise<TravelTicket[]> {
    return this.travelTicketModel.find().exec();
  }

  async findOne(id: string): Promise<TravelTicket> {
    const ticket = await this.travelTicketModel.findById(id).exec();
    if (!ticket) {
      throw new NotFoundException(`TravelTicket with ID ${id} not found`);
    }
    return ticket;
  }

  async update(id: string, updateTravelTicketDto: UpdateTravelTicketDto): Promise<TravelTicket> {
    const updatedTicket = await this.travelTicketModel
      .findByIdAndUpdate(id, updateTravelTicketDto, { new: true })
      .exec();
    if (!updatedTicket) {
      throw new NotFoundException(`TravelTicket with ID ${id} not found`);
    }
    return updatedTicket;
  }

  async remove(id: string): Promise<TravelTicket> {
    const deletedTicket = await this.travelTicketModel.findByIdAndDelete(id).exec();
    if (!deletedTicket) {
      throw new NotFoundException(`TravelTicket with ID ${id} not found`);
    }
    return deletedTicket;
  }
}