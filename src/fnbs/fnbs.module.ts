import { Module } from '@nestjs/common';
import { FnbsService } from './fnbs.service';
import { FnbsController } from './fnbs.controller';
import { PrismaModule } from 'src/prisma.module';
import { ShopsModule } from 'src/shops/shops.module';

@Module({
  imports: [PrismaModule, ShopsModule],
  controllers: [FnbsController],
  providers: [FnbsService],
})
export class FnbsModule {}
