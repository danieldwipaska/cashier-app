import { Test, TestingModule } from '@nestjs/testing';
import { FnbModifiersService } from './fnb-modifiers.service';

describe('FnbModifiersService', () => {
  let service: FnbModifiersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FnbModifiersService],
    }).compile();

    service = module.get<FnbModifiersService>(FnbModifiersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
