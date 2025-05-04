import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BackofficeSettingsService } from './backoffice-settings.service';
import { CreateBackofficeSettingDto } from './dto/create-backoffice-setting.dto';
import { ValidationPipe } from 'src/validation.pipe';

@Controller('backoffice-settings')
export class BackofficeSettingsController {
  constructor(
    private readonly backofficeSettingsService: BackofficeSettingsService,
  ) {}

  @Post()
  create(
    @Body(new ValidationPipe())
    createBackofficeSettingDto: CreateBackofficeSettingDto,
  ) {
    return this.backofficeSettingsService.create(createBackofficeSettingDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.backofficeSettingsService.findOne(id);
  }
}
