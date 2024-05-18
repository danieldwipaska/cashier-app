import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrismaModule } from 'src/prisma.module';
import { CrewsModule } from 'src/crews/crews.module';

@Module({
  imports: [PrismaModule, CrewsModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
