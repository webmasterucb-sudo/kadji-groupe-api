import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(createUserDto: any): Promise<UserDocument> {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    async findOne(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findById(userId: string): Promise<UserDocument | null> {
        return this.userModel.findById(userId).exec();
    }

    async updateOne(userId: string, updateUserDto: any): Promise<UserDocument | null> {
        return this.userModel.findByIdAndUpdate(userId, updateUserDto).exec();
    }

    async onChangeStatutCompte(userId: string, statutCompte: string): Promise<UserDocument | null> {
        return this.userModel.findByIdAndUpdate(userId, { statutCompte }).exec();
    }

    async deleteOne(userId: string): Promise<UserDocument | null> {
        return this.userModel.findByIdAndDelete(userId).exec();
    }
}
