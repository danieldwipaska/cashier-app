import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BackofficeSettingsService } from './backoffice-settings.service';
import { CreateBackofficeSettingDto } from './dto/create-backoffice-setting.dto';
import { ValidationPipe } from 'src/validation.pipe';
import { AuthGuard, RoleGuard, ShopGuard } from 'src/auth/auth.guard';
import { UpdateBackofficeSettingDto } from './dto/update-backoffice-setting.dto';
import { UserRole } from 'src/enums/user';

@Controller('backoffice-settings')
export class BackofficeSettingsController {
  constructor(
    private readonly backofficeSettingsService: BackofficeSettingsService,
  ) {}

  @UseGuards(
    AuthGuard,
    new RoleGuard([UserRole.ADMIN, UserRole.GREETER, UserRole.MANAGER]),
    ShopGuard,
  )
  @Post()
  create(
    @Body(new ValidationPipe())
    createBackofficeSettingDto: CreateBackofficeSettingDto,
    @Req() request: Request,
  ) {
    return this.backofficeSettingsService.create(
      request,
      createBackofficeSettingDto,
    );
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Get()
  findOne(@Req() request: Request) {
    return this.backofficeSettingsService.findOne(request);
  }

  @UseGuards(
    AuthGuard,
    new RoleGuard([UserRole.ADMIN, UserRole.GREETER, UserRole.MANAGER]),
    ShopGuard,
  )
  @Patch()
  update(
    @Req() request: Request,
    @Body() updateBackofficeSettingDto: UpdateBackofficeSettingDto,
  ) {
    return this.backofficeSettingsService.update(
      request,
      updateBackofficeSettingDto,
    );
  }
}
