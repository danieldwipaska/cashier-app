import { Module, Global } from '@nestjs/common';
import { CustomLoggerService } from './custom-logger.service';
import { VersionService } from './version.service';

@Global()
@Module({
  providers: [VersionService, CustomLoggerService],
  exports: [CustomLoggerService, VersionService],
})
export class LoggerModule {}
