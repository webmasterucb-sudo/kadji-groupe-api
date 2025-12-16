import { Test, TestingModule } from '@nestjs/testing';
import { TravelTicketsController } from './ceo-office-app.controller';
import { TravelTicketsService } from './ceo-office-app.service';

describe('TravelTicketsController', () => {
  let controller: TravelTicketsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelTicketsController],
      providers: [TravelTicketsService],
    }).compile();

    controller = module.get<TravelTicketsController>(TravelTicketsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
