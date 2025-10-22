// import { Injectable } from '@nestjs/common';
// import { CreateOffresEmploisDto } from './dto/create-offres-emplois.dto';
// import { UpdateOffresEmploisDto } from './dto/update-offres-emplois.dto';

// @Injectable()
// export class OffresEmploisService {
//   create(createOffresEmploisDto: CreateOffresEmploisDto) {
//     return 'This action adds a new offresEmplois';
//   }

//   findAll() {
//     return `This action returns all offresEmplois`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} offresEmplois`;
//   }

//   update(id: number, updateOffresEmploisDto: UpdateOffresEmploisDto) {
//     return `This action updates a #${id} offresEmplois`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} offresEmplois`;
//   }
// }




// =====================================================
// 3. SERVICE (job-offers.service.ts)
// =====================================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateJobOfferDto } from './dto/create-offres-emplois.dto';
import { UpdateJobOfferDto } from './dto/update-offres-emplois.dto';
import { JobOffer, JobOfferDocument } from './schemas/offres-emplois.schema';

@Injectable()
export class JobOffersService {
  constructor(
    @InjectModel(JobOffer.name)
    private jobOfferModel: Model<JobOfferDocument>,
  ) { }

  async create(createJobOfferDto: CreateJobOfferDto): Promise<JobOffer> {
    const createdJobOffer = new this.jobOfferModel({
      ...createJobOfferDto,
      totalPostuleNumber: 0,
    });
    console.log(createJobOfferDto);
    return createdJobOffer.save();
  }

  async findAll(page: number = 1, limit: number = 10, isActive?: boolean,): Promise<{ data: JobOffer[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const filter = isActive !== undefined ? { isActive } : {};

    const [data, total] = await Promise.all([
      this.jobOfferModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.jobOfferModel.countDocuments(filter),
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit), };
  }


  async findOne(id: string): Promise<JobOffer> {
    const jobOffer = await this.jobOfferModel.findById(id).exec();
    if (!jobOffer) {
      throw new NotFoundException(`Offre d'emploi avec l'ID ${id} introuvable`);
    }
    return jobOffer;
  }

  async update(id: string, updateJobOfferDto: UpdateJobOfferDto): Promise<JobOffer> {
    const updatedJobOffer = await this.jobOfferModel
      .findByIdAndUpdate(id, updateJobOfferDto, { new: true })
      .exec();

    if (!updatedJobOffer) {
      throw new NotFoundException(`Offre d'emploi avec l'ID ${id} introuvable`);
    }
    return updatedJobOffer;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.jobOfferModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Offre d'emploi avec l'ID ${id} introuvable`);
    }
    return { message: `Offre d'emploi supprimée avec succès` };
  }

  async incrementApplicationCount(id: string): Promise<JobOffer> {
    const updatedJobOffer = await this.jobOfferModel.findByIdAndUpdate( id, { $inc: { totalPostuleNumber: 1 } }, { new: true } ).exec();

    if (!updatedJobOffer) {
      throw new NotFoundException(`Offre d'emploi avec l'ID ${id} introuvable`);
    }
    return updatedJobOffer;
  }

  async searchByTitle(title: string): Promise<JobOffer[]> {
    return this.jobOfferModel.find({ title: { $regex: title, $options: 'i' }, isActive: true }).sort({ createdAt: -1 }).exec();
  }

}

