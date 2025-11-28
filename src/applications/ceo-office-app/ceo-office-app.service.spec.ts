import { Test, TestingModule } from '@nestjs/testing';
import { CeoOfficeAppService } from './ceo-office-app.service';

describe('CeoOfficeAppService', () => {
  let service: CeoOfficeAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CeoOfficeAppService],
    }).compile();

    service = module.get<CeoOfficeAppService>(CeoOfficeAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
