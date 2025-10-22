import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from './schemas/finance-schema';
import { CreateUsersDto } from './dto/create-finance-app.dto';
import { UpdateUserAppDto } from './dto/update-finance-app.dto';

@Injectable()
export class FinanceAppService {


  constructor(@InjectModel(Users.name) private userModel: Model<Users>, ){

  }


  onCreateUser(userDTO: CreateUsersDto): Promise<Users> {
    const createdUser= new this.userModel(userDTO);
    return createdUser.save();
  }


  async findAllUsers() {
    let datas = await this.userModel.find().sort({ updatedAt: -1 }).limit(100).exec();
    return datas;
  }

  findOne(id: number) {
    return `This action returns a #${id} Users`;
  }

  async onUpdateUser(id: string, updateUsersDto: UpdateUserAppDto): Promise<Users> {
    const updatedArticle = await this.userModel.findByIdAndUpdate(id, updateUsersDto, { new: true })
      .exec();
    if (!updatedArticle) {
      throw new NotFoundException(`Article avec l'ID ${id} non trouvé`);
    }
    return updatedArticle;
  }

    async onDeleteUser(id: string): Promise<{ message: string }> {
      const result = await this.userModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Offre d'emploi avec l'ID ${id} introuvable`);
      }
      return { message: `Offre d'emploi supprimée avec succès` };
    }
}
