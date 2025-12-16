import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TravelTicket } from '../entities/ceo-office-app.entity';
import { MailService } from 'src/core/mail/mail.service';
import { CreateTravelTicketDto } from '../dto/create-ceo-office-app.dto';
import { UpdateTravelTicketDto } from '../dto/update-ceo-office-app.dto';

@Injectable()
export class TravelTicketPublicService {
  constructor(
    @InjectModel(TravelTicket.name)
    private travelTicketPublicModel: Model<TravelTicket>,
    private readonly mailService: MailService,
  ) {}

  async create(
    createTravelTicketPublicDto: CreateTravelTicketDto,
  ): Promise<TravelTicket> {
    const createdTicket = new this.travelTicketPublicModel(
      createTravelTicketPublicDto,
    );
    const data = await createdTicket.save();

    // Send email notification
    const validationLink = `http://localhost:4200/#/ceo-validation-director-interface/${data._id}`;
    // const validationLink = `https://kadji-groupe-operations-app.netlify.app/#/ceo-validation-director-interface/${data._id}`; // Placeholder link
    await this.mailService.sendEmailToValidateur(
      createTravelTicketPublicDto.emailValidateur,
      'Nouvelle demande de billet de voyage',
      `${createTravelTicketPublicDto.nom}  ${createTravelTicketPublicDto.prenom}`, // Assuming the recipient name is known or static for now
      `Une nouvelle demande de billet de voyage a été créée pour.`,
      validationLink,
    );

    return data;
  }

  async findAll(): Promise<TravelTicket[]> {
    const data = await this.travelTicketPublicModel
      .find()
      .sort({ updatedAt: -1 })
      .exec();
    return data;
  }

  async findOne(id: string): Promise<TravelTicket | null> {
    const data = await this.travelTicketPublicModel.findById(id).exec();
    return data;
  }

  async update(
    id: string,
    updateTravelTicketDto: UpdateTravelTicketDto,
  ): Promise<TravelTicket | null> {
    const data = await this.travelTicketPublicModel
      .findByIdAndUpdate(id, updateTravelTicketDto, { new: true })
      .exec();
    return data;
  }

  async remove(id: string): Promise<TravelTicket | null> {
    const data = await this.travelTicketPublicModel
      .findByIdAndDelete(id)
      .exec();
    return data;
  }

  async onAprouveDemande(
    id: string,
    isAprouve: boolean,
  ): Promise<TravelTicket | null> {
    const status: string = isAprouve ? 'APPROVED' : 'REJECTED';
    const data: any = await this.travelTicketPublicModel
      .findByIdAndUpdate(id, { status: status }, { new: true })
      .exec();
    await this.mailService.sendTicketStatusNotification(
      data.emailDemandeur,
      `${data.nom} ${data.prenom}`,
      status,
    );

    if (isAprouve) {
      await this.mailService.sendTicketPendingFinalApprovalToDirector(
        'MOYENS GENEREAUX',
        `${data.nom} ${data.prenom}`,
        data.entreprise,
        data.departement,
        data.villeDestination,
        data.dateDepart,
      );
    }
    return data;
  }
}
