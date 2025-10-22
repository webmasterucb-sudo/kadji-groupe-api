import { Test, TestingModule } from '@nestjs/testing';
import { FormulairesController } from './formulaires.controller';
import { FormulairesService } from './formulaires.service';

describe('FormulairesController', () => {
  let controller: FormulairesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormulairesController],
      providers: [FormulairesService],
    }).compile();

    controller = module.get<FormulairesController>(FormulairesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
