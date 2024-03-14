import { Test, TestingModule } from '@nestjs/testing';
import { FnbsService } from './fnbs.service';

describe('FnbsService', () => {
  let service: FnbsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FnbsService],
    }).compile();

    service = module.get<FnbsService>(FnbsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
