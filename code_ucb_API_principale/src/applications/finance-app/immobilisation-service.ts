import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BienImmo } from './schemas/immoSchema';
import { UpdateBienImmoDto } from './dto/update-finance-app.dto';
import { CreateBienImmoDto } from './dto/bienImmo.dto';


@Injectable()
export class BiensImmoService {
  constructor(@InjectModel(BienImmo.name) private readonly bienModel: Model<BienImmo>) {}

  async create(createBienImmoDto: CreateBienImmoDto): Promise<BienImmo> {
    const createdBien = new this.bienModel(createBienImmoDto);
    return createdBien.save();
  }

  async findAll(): Promise<BienImmo[]> {
    return this.bienModel.find().exec();
  }

  async findOne(id: string): Promise<BienImmo> {
    const bien = await this.bienModel.findById(id).exec();
    if (!bien) {
      throw new NotFoundException(`Le bien avec l'ID "${id}" n'a pas été trouvé.`);
    }
    return bien;
  }

  async update(id: string, updateBienImmoDto: UpdateBienImmoDto): Promise<BienImmo> {
    const updatedBien = await this.bienModel
      .findByIdAndUpdate(id, updateBienImmoDto, { new: true }) // { new: true } pour retourner le document mis à jour
      .exec();

    if (!updatedBien) {
      throw new NotFoundException(`Le bien avec l'ID "${id}" n'a pas été trouvé.`);
    }
    return updatedBien;
  }

  async remove(id: string): Promise<BienImmo> {
    const deletedBien = await this.bienModel.findByIdAndDelete(id).exec();
    if (!deletedBien) {
      throw new NotFoundException(`Le bien avec l'ID "${id}" n'a pas été trouvé.`);
    }
    return deletedBien;
  }
}

