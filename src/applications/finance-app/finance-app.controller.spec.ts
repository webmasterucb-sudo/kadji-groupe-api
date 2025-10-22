import { Test, TestingModule } from '@nestjs/testing';
import { FinanceAppController } from './finance-app.controller';
import { FinanceAppService } from './finance-app.service';

describe('FinanceAppController', () => {
  let controller: FinanceAppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinanceAppController],
      providers: [FinanceAppService],
    }).compile();

    controller = module.get<FinanceAppController>(FinanceAppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
