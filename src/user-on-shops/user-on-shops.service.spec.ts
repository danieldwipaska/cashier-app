import { Test, TestingModule } from '@nestjs/testing';
import { UserOnShopsService } from './user-on-shops.service';

describe('UserOnShopsService', () => {
  let service: UserOnShopsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserOnShopsService],
    }).compile();

    service = module.get<UserOnShopsService>(UserOnShopsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
