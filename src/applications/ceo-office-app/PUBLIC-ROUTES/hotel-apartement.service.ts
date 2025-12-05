import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHotelApartementDto } from './dto/create-hotel-apartement.dto';
import { UpdateHotelApartementDto } from './dto/update-hotel-apartement.dto';
import { HotelApartement } from './entities/hotel-apartement.entity';
import { MailService } from 'src/core/mail/mail.service';

@Injectable()
export class HotelApartementService {
    constructor(
        @InjectModel(HotelApartement.name) private hotelApartementModel: Model<HotelApartement>,
        private readonly mailService: MailService,
    ) { }

    async create(createHotelApartementDto: CreateHotelApartementDto): Promise<HotelApartement> {
        const createdHotelApartement = new this.hotelApartementModel(createHotelApartementDto);
        let data = await createdHotelApartement.save();

        // Send email notification
        const validationLink = `https://kadji-groupe-operations-app.netlify.app/ceo-validation-director-interface/hotel/${data._id}`;
        await this.mailService.sendEmailToEmployee(
            'christian.nana@sa-ucb.com',
            'Nouvelle demande de réservation d\'hôtel',
            `${createHotelApartementDto.nomOccupant} ${createHotelApartementDto.prenomOccupant}`,
            `Une nouvelle demande de réservation d'hôtel a été créée.`,
            validationLink
        );

        return data;
    }

    async findAll(): Promise<HotelApartement[]> {
        return this.hotelApartementModel.find().exec();
    }

    async findOne(id: string): Promise<HotelApartement | null> {
        return this.hotelApartementModel.findById(id).exec();
    }

    async update(id: string, updateHotelApartementDto: UpdateHotelApartementDto): Promise<HotelApartement | null> {
        return this.hotelApartementModel.findByIdAndUpdate(id, updateHotelApartementDto, { new: true }).exec();
    }

    async remove(id: string): Promise<HotelApartement | null> {
        return this.hotelApartementModel.findByIdAndDelete(id).exec();
    }

    async onAprouveDemande(id: string, isAprouve: boolean): Promise<HotelApartement | null> {
        const status = isAprouve ? 'CONFIRME' : 'ANNULE';
        return this.hotelApartementModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    }
}
