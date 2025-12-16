import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let service: EmployeeService;

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

  const mockEmployeeService = {
    create: jest.fn().mockResolvedValue(mockEmployee),
    findAll: jest.fn().mockResolvedValue([mockEmployee]),
    findOne: jest.fn().mockResolvedValue(mockEmployee),
    findByMatricule: jest.fn().mockResolvedValue(mockEmployee),
    findByDepartement: jest.fn().mockResolvedValue([mockEmployee]),
    findByStatut: jest.fn().mockResolvedValue([mockEmployee]),
    findByEntreprise: jest.fn().mockResolvedValue([mockEmployee]),
    update: jest.fn().mockResolvedValue(mockEmployee),
    remove: jest.fn().mockResolvedValue(mockEmployee),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        {
          provide: EmployeeService,
          useValue: mockEmployeeService,
        },
      ],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
    service = module.get<EmployeeService>(EmployeeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new employee', async () => {
      const createDto = mockEmployee;
      const result = await controller.create(createDto as any);
      expect(result).toEqual(mockEmployee);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of employees', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockEmployee]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should filter by departement', async () => {
      const result = await controller.findAll('IT');
      expect(result).toEqual([mockEmployee]);
      expect(service.findByDepartement).toHaveBeenCalledWith('IT');
    });
  });

  describe('findOne', () => {
    it('should return a single employee', async () => {
      const result = await controller.findOne('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockEmployee);
      expect(service.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });

  describe('findByMatricule', () => {
    it('should return an employee by matricule', async () => {
      const result = await controller.findByMatricule('EMP001');
      expect(result).toEqual(mockEmployee);
      expect(service.findByMatricule).toHaveBeenCalledWith('EMP001');
    });
  });

  describe('update', () => {
    it('should update an employee', async () => {
      const updateDto = { nom: 'Updated' };
      const result = await controller.update(
        '507f1f77bcf86cd799439011',
        updateDto as any,
      );
      expect(result).toEqual(mockEmployee);
      expect(service.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete an employee', async () => {
      const result = await controller.remove('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockEmployee);
      expect(service.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });
});
