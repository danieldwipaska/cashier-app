import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrismaModule } from 'src/prisma.module';
import { CrewsModule } from 'src/crews/crews.module';
import { ShopsModule } from 'src/shops/shops.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, CrewsModule, ShopsModule, HttpModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
