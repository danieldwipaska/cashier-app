import { Test, TestingModule } from '@nestjs/testing';
import { FnbModifiersController } from './fnb-modifiers.controller';
import { FnbModifiersService } from './fnb-modifiers.service';

describe('FnbModifiersController', () => {
  let controller: FnbModifiersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FnbModifiersController],
      providers: [FnbModifiersService],
    }).compile();

    controller = module.get<FnbModifiersController>(FnbModifiersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
