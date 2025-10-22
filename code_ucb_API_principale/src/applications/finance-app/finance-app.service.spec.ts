import { Test, TestingModule } from '@nestjs/testing';
import { FinanceAppService } from './finance-app.service';

describe('FinanceAppService', () => {
  let service: FinanceAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinanceAppService],
    }).compile();

    service = module.get<FinanceAppService>(FinanceAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
