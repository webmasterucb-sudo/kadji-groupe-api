import { Test, TestingModule } from '@nestjs/testing';
import { OffreEmploisController } from './offre-emplois.controller';
import { OffreEmploisService } from './offre-emplois.service';

describe('OffreEmploisController', () => {
  let controller: OffreEmploisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffreEmploisController],
      providers: [OffreEmploisService],
    }).compile();

    controller = module.get<OffreEmploisController>(OffreEmploisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
