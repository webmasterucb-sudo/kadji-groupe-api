import { Injectable } from '@nestjs/common';
import { CreateOffreEmploisDto } from './dto/create-offre-emplois.dto';
import { UpdateOffreEmploisDto } from './dto/update-offre-emplois.dto';

@Injectable()
export class OffreEmploisService {
  create(createOffreEmploisDto: CreateOffreEmploisDto) {
    return 'This action adds a new offreEmplois';
  }

  findAll() {
    return `This action returns all offreEmplois`;
  }

  findOne(id: number) {
    return `This action returns a #${id} offreEmplois`;
  }

  update(id: number, updateOffreEmploisDto: UpdateOffreEmploisDto) {
    return `This action updates a #${id} offreEmplois`;
  }

  remove(id: number) {
    return `This action removes a #${id} offreEmplois`;
  }
}

