import { Test, TestingModule } from '@nestjs/testing';
import { FnbsController } from './fnbs.controller';
import { FnbsService } from './fnbs.service';

describe('FnbsController', () => {
  let controller: FnbsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FnbsController],
      providers: [FnbsService],
    }).compile();

    controller = module.get<FnbsController>(FnbsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
