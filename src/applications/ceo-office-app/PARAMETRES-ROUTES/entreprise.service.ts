import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEntrepriseDto } from './dto/create-entreprise.dto';
import { UpdateEntrepriseDto } from './dto/update-entreprise.dto';
import { Entreprise, EntrepriseDocument } from './entities/entreprise.entity';

@Injectable()
export class EntrepriseService {
    constructor(
        @InjectModel(Entreprise.name)
        private readonly entrepriseModel: Model<EntrepriseDocument>,
    ) { }

    async findAll(): Promise<EntrepriseDocument[]> {
        return await this.entrepriseModel
            .find()
            .sort({ createdAt: -1 })
            .exec();
    }

    async findOne(id: string): Promise<EntrepriseDocument> {
        const entreprise = await this.entrepriseModel.findById(id).exec();
        if (!entreprise) {
            throw new NotFoundException(`Entreprise avec l'ID ${id} non trouvée`);
        }
        return entreprise;
    }

    async create(createEntrepriseDto: CreateEntrepriseDto): Promise<EntrepriseDocument> {
        const existingEntreprise = await this.entrepriseModel
            .findOne({ nom: createEntrepriseDto.nom })
            .exec();

        if (existingEntreprise) {
            throw new ConflictException('Une entreprise avec ce nom existe déjà');
        }

        const createdEntreprise = new this.entrepriseModel(createEntrepriseDto);
        return await createdEntreprise.save();
    }

    async update(id: string, updateEntrepriseDto: UpdateEntrepriseDto): Promise<EntrepriseDocument> {
        const entreprise = await this.entrepriseModel.findById(id).exec();

        if (!entreprise) {
            throw new NotFoundException(`Entreprise avec l'ID ${id} non trouvée`);
        }

        if (updateEntrepriseDto.nom && updateEntrepriseDto.nom !== entreprise.nom) {
            const existingName = await this.entrepriseModel
                .findOne({ nom: updateEntrepriseDto.nom })
                .exec();
            if (existingName) {
                throw new ConflictException('Une entreprise avec ce nom existe déjà');
            }
        }

        const updatedEntreprise = await this.entrepriseModel
            .findByIdAndUpdate(id, updateEntrepriseDto, { new: true })
            .exec();

        return updatedEntreprise!;
    }

    async remove(id: string): Promise<{ success: boolean; message: string }> {
        const result = await this.entrepriseModel.findByIdAndDelete(id).exec();

        if (!result) {
            throw new NotFoundException(`Entreprise avec l'ID ${id} non trouvée`);
        }

        return {
            success: true,
            message: 'Entreprise supprimée avec succès',
        };
    }
}
