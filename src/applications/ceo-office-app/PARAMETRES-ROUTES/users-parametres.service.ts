import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminUser, AdminUserDocument } from 'src/core/users/entities/user.entity';

@Injectable()
export class UsersParametresService {
  constructor(
    @InjectModel(AdminUser.name)
    private readonly userModel: Model<AdminUserDocument>,
  ) { }

  /**
   * Récupérer tous les utilisateurs
   */
  async findAll(): Promise<AdminUserDocument[]> {
    return await this.userModel
      .find()
      .select('-password')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Récupérer un utilisateur par ID
   */
  async findOne(id: string): Promise<AdminUserDocument> {
    const user = await this.userModel
      .findById(id)
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }
    return user;
  }

  /**
   * Créer un nouvel utilisateur
   */
  async create(createUserDto: CreateUserDto): Promise<AdminUserDocument> {
    // Vérifier si l'email existe déjà
    const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec();

    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    // Retourner sans le mot de passe
    const userWithoutPassword = await this.userModel.findById(savedUser._id).select('-password').exec();
    return userWithoutPassword!;
  }

  /**
   * Mettre à jour un utilisateur
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<AdminUserDocument> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    // Si l'email est modifié, vérifier qu'il n'existe pas déjà
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userModel.findOne({ email: updateUserDto.email }).exec();
      if (existingUser) {
        throw new ConflictException('Cet email est déjà utilisé');
      }
    }

    // Si le mot de passe est modifié, le hasher
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    return await this.findOne(id);
  }

  /**
   * Supprimer un utilisateur
   */
  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    await this.userModel.findByIdAndDelete(id).exec();

    return {
      success: true,
      message: 'Utilisateur supprimé avec succès',
    };
  }



  /**
   * Vérifier si un email existe déjà
   */
  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).exec();
    return !!user;
  }

  /**
   * Vérifier les identifiants d'un utilisateur
   */
  async verifyCredentials(email: string, password: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      return false;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid;
  }



}
