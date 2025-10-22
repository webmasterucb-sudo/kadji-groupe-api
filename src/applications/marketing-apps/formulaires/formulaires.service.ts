import { Injectable } from '@nestjs/common';
import { ContactFormDto } from './dto/create-formulaire.dto';
import { UpdateFormulaireDto } from './dto/update-formulaire.dto';
import { ContactForm } from './entities/formulaire.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FormulairesService {

  constructor(@InjectModel(ContactForm.name) private contactForm: Model<ContactForm>) {}

 async create(contactDto: ContactFormDto) {
  const form = new this.contactForm(contactDto)
    console.log("Formulaire DTO", contactDto);
    return form.save();
  }

  async findAll() {
    let datas = await this.contactForm.find().sort({ createdAt: -1 }).limit(200).exec();
    return datas;
  }

  findOne(id: number) {
    return `This action returns a #${id} formulaire`;
  }

  update(id: number, updateFormulaireDto: UpdateFormulaireDto) {
    return `This action updates a #${id} formulaire`;
  }

  remove(id: number) {
    return `This action removes a #${id} formulaire`;
  }
}
