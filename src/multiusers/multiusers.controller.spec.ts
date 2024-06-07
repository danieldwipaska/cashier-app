import { Test, TestingModule } from '@nestjs/testing';
import { MultiusersController } from './multiusers.controller';
import { MultiusersService } from './multiusers.service';

describe('MultiusersController', () => {
  let controller: MultiusersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MultiusersController],
      providers: [MultiusersService],
    }).compile();

    controller = module.get<MultiusersController>(MultiusersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
