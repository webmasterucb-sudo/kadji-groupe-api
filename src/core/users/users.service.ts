import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminUser } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(AdminUser.name) private userModel: Model<AdminUser>,
  ) {}

  async create(createUserDto: any): Promise<AdminUser> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findOne(email: string): Promise<AdminUser | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(userId: string): Promise<AdminUser | null> {
    return this.userModel.findById(userId).exec();
  }

  async updateOne(
    userId: string,
    updateUserDto: any,
  ): Promise<AdminUser | null> {
    return this.userModel.findByIdAndUpdate(userId, updateUserDto).exec();
  }

  async onChangeStatutCompte(
    userId: string,
    statutCompte: string,
  ): Promise<AdminUser | null> {
    return this.userModel.findByIdAndUpdate(userId, { statutCompte }).exec();
  }

  async deleteOne(userId: string): Promise<AdminUser | null> {
    return this.userModel.findByIdAndDelete(userId).exec();
  }
}
