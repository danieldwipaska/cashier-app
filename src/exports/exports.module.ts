import { Module } from '@nestjs/common';
import { ExportsService } from './exports.service';
import { ExportsController } from './exports.controller';
import { PrismaModule } from 'src/prisma.module';
import { ShopsModule } from 'src/shops/shops.module';

@Module({
  imports: [PrismaModule, ShopsModule],
  controllers: [ExportsController],
  providers: [ExportsService],
})
export class ExportsModule {}
