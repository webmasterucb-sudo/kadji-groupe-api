import { Test, TestingModule } from '@nestjs/testing';
import { FormulairesService } from './formulaires.service';

describe('FormulairesService', () => {
  let service: FormulairesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormulairesService],
    }).compile();

    service = module.get<FormulairesService>(FormulairesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
