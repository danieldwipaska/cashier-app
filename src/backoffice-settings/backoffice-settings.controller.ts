import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BackofficeSettingsService } from './backoffice-settings.service';
import { CreateBackofficeSettingDto } from './dto/create-backoffice-setting.dto';
import { UpdateBackofficeSettingDto } from './dto/update-backoffice-setting.dto';

@Controller('backoffice-settings')
export class BackofficeSettingsController {
  constructor(
    private readonly backofficeSettingsService: BackofficeSettingsService,
  ) {}

  @Post()
  create(@Body() createBackofficeSettingDto: CreateBackofficeSettingDto) {
    return this.backofficeSettingsService.create(createBackofficeSettingDto);
  }

  @Get()
  findAll() {
    return this.backofficeSettingsService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBackofficeSettingDto: UpdateBackofficeSettingDto,
  ) {
    return this.backofficeSettingsService.update(
      id,
      updateBackofficeSettingDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.backofficeSettingsService.remove(id);
  }
}
