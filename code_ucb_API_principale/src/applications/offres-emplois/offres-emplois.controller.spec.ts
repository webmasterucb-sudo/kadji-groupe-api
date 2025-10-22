import { Test, TestingModule } from '@nestjs/testing';
import { OffresEmploisController } from './offres-emplois.controller';
import { OffresEmploisService } from './offres-emplois.service';

describe('OffresEmploisController', () => {
  let controller: OffresEmploisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffresEmploisController],
      providers: [OffresEmploisService],
    }).compile();

    controller = module.get<OffresEmploisController>(OffresEmploisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
