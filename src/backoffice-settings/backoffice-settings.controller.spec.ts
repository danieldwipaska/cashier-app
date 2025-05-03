import { Test, TestingModule } from '@nestjs/testing';
import { BackofficeSettingsController } from './backoffice-settings.controller';
import { BackofficeSettingsService } from './backoffice-settings.service';

describe('BackofficeSettingsController', () => {
  let controller: BackofficeSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BackofficeSettingsController],
      providers: [BackofficeSettingsService],
    }).compile();

    controller = module.get<BackofficeSettingsController>(BackofficeSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
