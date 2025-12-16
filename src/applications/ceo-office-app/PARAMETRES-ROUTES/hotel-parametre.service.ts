import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHotelParametreDto } from './dto/create-hotel-parametre.dto';
import { UpdateHotelParametreDto } from './dto/update-hotel-parametre.dto';
import {
  HotelParametre,
  HotelParametreDocument,
} from './entities/hotel-parametre.entity';

@Injectable()
export class HotelParametreService {
  constructor(
    @InjectModel(HotelParametre.name)
    private readonly hotelParametreModel: Model<HotelParametreDocument>,
  ) {}

  async findAll(): Promise<HotelParametreDocument[]> {
    return await this.hotelParametreModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<HotelParametreDocument> {
    const hotel = await this.hotelParametreModel.findById(id).exec();
    if (!hotel) {
      throw new NotFoundException(`Hôtel avec l'ID ${id} non trouvé`);
    }
    return hotel;
  }

  async create(
    createDto: CreateHotelParametreDto,
  ): Promise<HotelParametreDocument> {
    const existingHotel = await this.hotelParametreModel
      .findOne({ nom: createDto.nom })
      .exec();

    if (existingHotel) {
      throw new ConflictException('Un hôtel avec ce nom existe déjà');
    }

    const createdHotel = new this.hotelParametreModel(createDto);
    return await createdHotel.save();
  }

  async update(
    id: string,
    updateDto: UpdateHotelParametreDto,
  ): Promise<HotelParametreDocument> {
    const hotel = await this.hotelParametreModel.findById(id).exec();

    if (!hotel) {
      throw new NotFoundException(`Hôtel avec l'ID ${id} non trouvé`);
    }

    if (updateDto.nom && updateDto.nom !== hotel.nom) {
      const existingName = await this.hotelParametreModel
        .findOne({ nom: updateDto.nom })
        .exec();
      if (existingName) {
        throw new ConflictException('Un hôtel avec ce nom existe déjà');
      }
    }

    const updatedHotel = await this.hotelParametreModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    return updatedHotel!;
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.hotelParametreModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Hôtel avec l'ID ${id} non trouvé`);
    }

    return {
      success: true,
      message: 'Hôtel supprimé avec succès',
    };
  }
}
