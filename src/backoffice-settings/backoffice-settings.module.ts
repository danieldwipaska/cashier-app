import { Module } from '@nestjs/common';
import { BackofficeSettingsService } from './backoffice-settings.service';
import { BackofficeSettingsController } from './backoffice-settings.controller';
import { PrismaModule } from 'src/prisma.module';

@Module({
  controllers: [BackofficeSettingsController],
  providers: [BackofficeSettingsService],
  imports: [PrismaModule],
})
export class BackofficeSettingsModule {}
