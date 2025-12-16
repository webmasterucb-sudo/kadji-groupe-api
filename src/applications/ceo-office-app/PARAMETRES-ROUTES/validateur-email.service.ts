import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateValidateurEmailDto } from './dto/create-validateur-email.dto';
import { UpdateValidateurEmailDto } from './dto/update-validateur-email.dto';
import {
  ValidateurEmail,
  ValidateurEmailDocument,
} from './entities/validateur-email.entity';

@Injectable()
export class ValidateurEmailService {
  constructor(
    @InjectModel(ValidateurEmail.name)
    private readonly validateurEmailModel: Model<ValidateurEmailDocument>,
  ) {}

  async findAll(): Promise<ValidateurEmailDocument[]> {
    const data = await this.validateurEmailModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
    return data;
  }

  async findOne(id: string): Promise<ValidateurEmailDocument> {
    const validateur = await this.validateurEmailModel.findById(id).exec();
    if (!validateur) {
      throw new NotFoundException(`Validateur avec l'ID ${id} non trouvé`);
    }
    return validateur;
  }

  async create(
    createDto: CreateValidateurEmailDto,
  ): Promise<ValidateurEmailDocument> {
    const existingEmail = await this.validateurEmailModel
      .findOne({ email: createDto.email })
      .exec();

    if (existingEmail) {
      throw new ConflictException(
        'Cet email est déjà enregistré comme validateur',
      );
    }

    const createdValidateur = new this.validateurEmailModel(createDto);
    return await createdValidateur.save();
  }

  async update(
    id: string,
    updateDto: UpdateValidateurEmailDto,
  ): Promise<ValidateurEmailDocument> {
    const validateur = await this.validateurEmailModel.findById(id).exec();

    if (!validateur) {
      throw new NotFoundException(`Validateur avec l'ID ${id} non trouvé`);
    }

    if (updateDto.email && updateDto.email !== validateur.email) {
      const existingEmail = await this.validateurEmailModel
        .findOne({ email: updateDto.email })
        .exec();
      if (existingEmail) {
        throw new ConflictException(
          'Cet email est déjà enregistré comme validateur',
        );
      }
    }

    const updatedValidateur = await this.validateurEmailModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    return updatedValidateur!;
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.validateurEmailModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Validateur avec l'ID ${id} non trouvé`);
    }

    return {
      success: true,
      message: 'Validateur supprimer avec succès',
    };
  }
}
