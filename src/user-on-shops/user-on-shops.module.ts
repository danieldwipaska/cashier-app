import { Module } from '@nestjs/common';
import { UserOnShopsService } from './user-on-shops.service';
import { UserOnShopsController } from './user-on-shops.controller';
import { PrismaModule } from 'src/prisma.module';

@Module({
  controllers: [UserOnShopsController],
  providers: [UserOnShopsService],
  imports: [PrismaModule],
})
export class UserOnShopsModule {}
