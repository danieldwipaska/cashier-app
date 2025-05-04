import { Test, TestingModule } from '@nestjs/testing';
import { UserOnShopsController } from './user-on-shops.controller';
import { UserOnShopsService } from './user-on-shops.service';

describe('UserOnShopsController', () => {
  let controller: UserOnShopsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserOnShopsController],
      providers: [UserOnShopsService],
    }).compile();

    controller = module.get<UserOnShopsController>(UserOnShopsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
