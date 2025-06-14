import { Module } from '@nestjs/common';
import { BackofficeSettingsService } from './backoffice-settings.service';
import { BackofficeSettingsController } from './backoffice-settings.controller';
import { PrismaModule } from 'src/prisma.module';
import { ShopsModule } from 'src/shops/shops.module';

@Module({
  controllers: [BackofficeSettingsController],
  providers: [BackofficeSettingsService],
  imports: [PrismaModule, ShopsModule],
})
export class BackofficeSettingsModule {}
