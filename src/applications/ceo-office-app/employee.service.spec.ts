import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let model: Model<Employee>;

  const mockEmployee = {
    _id: '507f1f77bcf86cd799439011',
    nom: 'Doe',
    prenom: 'John',
    matricule: 'EMP001',
    telephone: '+243900000000',
    sexe: 'M',
    entreprise: 'UCB',
    fonction: 'Developer',
    departement: 'IT',
    statut: 'actif',
    membreFamille: [],
  };

  const mockEmployeeModel = {
    new: jest.fn().mockResolvedValue(mockEmployee),
    constructor: jest.fn().mockResolvedValue(mockEmployee),
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    exec: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: getModelToken(Employee.name),
          useValue: mockEmployeeModel,
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    model = module.get<Model<Employee>>(getModelToken(Employee.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new employee', async () => {
      jest.spyOn(model, 'create').mockResolvedValueOnce(mockEmployee as any);
      const newEmployee = await service.create(mockEmployee as any);
      expect(newEmployee).toEqual(mockEmployee);
    });
  });

  describe('findAll', () => {
    it('should return an array of employees', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce([mockEmployee]),
      } as any);
      const employees = await service.findAll();
      expect(employees).toEqual([mockEmployee]);
    });
  });

  describe('findOne', () => {
    it('should return a single employee', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockEmployee),
      } as any);
      const employee = await service.findOne('507f1f77bcf86cd799439011');
      expect(employee).toEqual(mockEmployee);
    });

    it('should throw NotFoundException if employee not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an employee', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockEmployee),
      } as any);
      const updatedEmployee = await service.update('507f1f77bcf86cd799439011', {
        nom: 'Updated',
      });
      expect(updatedEmployee).toEqual(mockEmployee);
    });

    it('should throw NotFoundException if employee not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      await expect(
        service.update('507f1f77bcf86cd799439011', { nom: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an employee', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockEmployee),
      } as any);
      const deletedEmployee = await service.remove('507f1f77bcf86cd799439011');
      expect(deletedEmployee).toEqual(mockEmployee);
    });

    it('should throw NotFoundException if employee not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
