import { Test, TestingModule } from '@nestjs/testing';
import { OffresEmploisService } from './offres-emplois.service';

describe('OffresEmploisService', () => {
  let service: OffresEmploisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OffresEmploisService],
    }).compile();

    service = module.get<OffresEmploisService>(OffresEmploisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
