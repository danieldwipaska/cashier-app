import { Test, TestingModule } from '@nestjs/testing';
import { MultiusersService } from './multiusers.service';

describe('MultiusersService', () => {
  let service: MultiusersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MultiusersService],
    }).compile();

    service = module.get<MultiusersService>(MultiusersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
