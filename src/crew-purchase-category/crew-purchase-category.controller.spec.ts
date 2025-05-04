import { Test, TestingModule } from '@nestjs/testing';
import { CrewPurchaseCategoryController } from './crew-purchase-category.controller';
import { CrewPurchaseCategoryService } from './crew-purchase-category.service';

describe('CrewPurchaseCategoryController', () => {
  let controller: CrewPurchaseCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrewPurchaseCategoryController],
      providers: [CrewPurchaseCategoryService],
    }).compile();

    controller = module.get<CrewPurchaseCategoryController>(CrewPurchaseCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
