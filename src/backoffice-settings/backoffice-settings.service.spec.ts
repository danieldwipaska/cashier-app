import { Test, TestingModule } from '@nestjs/testing';
import { BackofficeSettingsService } from './backoffice-settings.service';

describe('BackofficeSettingsService', () => {
  let service: BackofficeSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BackofficeSettingsService],
    }).compile();

    service = module.get<BackofficeSettingsService>(BackofficeSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
