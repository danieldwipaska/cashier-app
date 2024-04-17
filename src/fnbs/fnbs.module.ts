import { Module } from '@nestjs/common';
import { FnbsService } from './fnbs.service';
import { FnbsController } from './fnbs.controller';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FnbsController],
  providers: [FnbsService],
})
export class FnbsModule {}
