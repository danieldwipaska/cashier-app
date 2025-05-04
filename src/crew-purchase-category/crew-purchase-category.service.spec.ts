import { Test, TestingModule } from '@nestjs/testing';
import { CrewPurchaseCategoryService } from './crew-purchase-category.service';

describe('CrewPurchaseCategoryService', () => {
  let service: CrewPurchaseCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrewPurchaseCategoryService],
    }).compile();

    service = module.get<CrewPurchaseCategoryService>(CrewPurchaseCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
