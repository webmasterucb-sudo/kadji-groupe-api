import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
  ) { }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    try {
      const createdEmployee = new this.employeeModel(createEmployeeDto);
      return await createdEmployee.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Un employé avec ce matricule existe déjà');
      }
      throw error;
    }
  }

  async findAll(): Promise<Employee[]> {
    return await this.employeeModel.find().sort({updatedAt: -1 }).limit(1200).exec();
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeModel.findById(id).exec();
    if (!employee) {
      throw new NotFoundException(`Employé avec l'ID ${id} non trouvé`);
    }
    return employee;
  }

  async findByMatricule(matricule: string): Promise<Employee> {
    const employee = await this.employeeModel.findOne({ matricule }).limit(1200).exec();
    if (!employee) {
      throw new NotFoundException(
        `Employé avec le matricule ${matricule} non trouvé`,
      );
    }
    return employee;
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    try {
      const updatedEmployee = await this.employeeModel
        .findByIdAndUpdate(id, updateEmployeeDto, { new: true })
        .exec();

      if (!updatedEmployee) {
        throw new NotFoundException(`Employé avec l'ID ${id} non trouvé`);
      }

      return updatedEmployee;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Un employé avec ce matricule existe déjà');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Employee> {
    const deletedEmployee = await this.employeeModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedEmployee) {
      throw new NotFoundException(`Employé avec l'ID ${id} non trouvé`);
    }
    return deletedEmployee;
  }

  async findByDepartement(departement: string): Promise<Employee[]> {
    return await this.employeeModel.find({ departement }).exec();
  }

  async findByStatut(statut: string): Promise<Employee[]> {
    return await this.employeeModel.find({ statut }).exec();
  }

  async findByEntreprise(entreprise: string): Promise<Employee[]> {
    return await this.employeeModel.find({ entreprise }).exec();
  }
}
