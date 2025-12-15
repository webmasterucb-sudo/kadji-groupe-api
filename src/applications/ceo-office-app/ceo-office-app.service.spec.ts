import { Test, TestingModule } from '@nestjs/testing';
import { TravelTicketsService } from './ceo-office-app.service';

describe('TravelTicketsService', () => {
  let service: TravelTicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TravelTicketsService],
    }).compile();

    service = module.get<TravelTicketsService>(TravelTicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
