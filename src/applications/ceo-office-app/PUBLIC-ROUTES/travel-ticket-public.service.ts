import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTravelTicketPublicDto } from './dto/create-travel-ticket-public.dto';
import { UpdateTravelTicketPublicDto } from './dto/update-travel-ticket-public.dto';
import { TravelTicket } from '../entities/ceo-office-app.entity';
import { MailService } from 'src/core/mail/mail.service';

@Injectable()
export class TravelTicketPublicService {
    constructor(
        @InjectModel(TravelTicket.name) private travelTicketPublicModel: Model<TravelTicket>,
        private readonly mailService: MailService,
    ) { }

    async create(createTravelTicketPublicDto: CreateTravelTicketPublicDto): Promise<TravelTicket> {
        const createdTicket = new this.travelTicketPublicModel(createTravelTicketPublicDto);
        let data = await createdTicket.save();

        // Send email notification
        // const validationLink = `http://localhost:4200/ceo-validation-director-interface/${data._id}`;
        const validationLink = `https://kadji-groupe-operations-app.netlify.app/ceo-validation-director-interface/${data._id}`; // Placeholder link
        await this.mailService.sendEmailToEmployee(
            createTravelTicketPublicDto.emailValidateur,
            'Nouvelle demande de billet de voyage',
            `${createTravelTicketPublicDto.nom}  ${createTravelTicketPublicDto.prenom}`, // Assuming the recipient name is known or static for now
            `Une nouvelle demande de billet de voyage a été créée pour.`,
            validationLink
        );

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



    async onAprouveDemande(id: string, isAprouve: boolean): Promise<TravelTicket | null> {
        let data = await this.travelTicketPublicModel.findByIdAndUpdate(id, { status: isAprouve ? 'APPROVED' : 'REJECTED' }, { new: true }).exec();
        return data;
    }
}
