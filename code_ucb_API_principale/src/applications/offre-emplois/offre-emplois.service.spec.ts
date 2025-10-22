import { Test, TestingModule } from '@nestjs/testing';
import { OffreEmploisService } from './offre-emplois.service';

describe('OffreEmploisService', () => {
  let service: OffreEmploisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OffreEmploisService],
    }).compile();

    service = module.get<OffreEmploisService>(OffreEmploisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
