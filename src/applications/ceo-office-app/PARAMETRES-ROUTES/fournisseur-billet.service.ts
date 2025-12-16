import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFournisseurBilletDto } from './dto/create-fournisseur-billet.dto';
import { UpdateFournisseurBilletDto } from './dto/update-fournisseur-billet.dto';
import {
  FournisseurBillet,
  FournisseurBilletDocument,
} from './entities/fournisseur-billet.entity';

@Injectable()
export class FournisseurBilletService {
  constructor(
    @InjectModel(FournisseurBillet.name)
    private readonly fournisseurBilletModel: Model<FournisseurBilletDocument>,
  ) {}

  async findAll(): Promise<FournisseurBilletDocument[]> {
    return await this.fournisseurBilletModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<FournisseurBilletDocument> {
    const fournisseur = await this.fournisseurBilletModel.findById(id).exec();
    if (!fournisseur) {
      throw new NotFoundException(`Fournisseur avec l'ID ${id} non trouvé`);
    }
    return fournisseur;
  }

  async create(
    createDto: CreateFournisseurBilletDto,
  ): Promise<FournisseurBilletDocument> {
    const existingFournisseur = await this.fournisseurBilletModel
      .findOne({ nom: createDto.nom })
      .exec();

    if (existingFournisseur) {
      throw new ConflictException('Un fournisseur avec ce nom existe déjà');
    }

    const createdFournisseur = new this.fournisseurBilletModel(createDto);
    return await createdFournisseur.save();
  }

  async update(
    id: string,
    updateDto: UpdateFournisseurBilletDto,
  ): Promise<FournisseurBilletDocument> {
    const fournisseur = await this.fournisseurBilletModel.findById(id).exec();

    if (!fournisseur) {
      throw new NotFoundException(`Fournisseur avec l'ID ${id} non trouvé`);
    }

    if (updateDto.nom && updateDto.nom !== fournisseur.nom) {
      const existingName = await this.fournisseurBilletModel
        .findOne({ nom: updateDto.nom })
        .exec();
      if (existingName) {
        throw new ConflictException('Un fournisseur avec ce nom existe déjà');
      }
    }

    const updatedFournisseur = await this.fournisseurBilletModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    return updatedFournisseur!;
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.fournisseurBilletModel
      .findByIdAndDelete(id)
      .exec();

    if (!result) {
      throw new NotFoundException(`Fournisseur avec l'ID ${id} non trouvé`);
    }

    return {
      success: true,
      message: 'Fournisseur supprimé avec succès',
    };
  }
}
