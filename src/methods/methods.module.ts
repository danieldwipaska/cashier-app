import { Module } from '@nestjs/common';
import { MethodsService } from './methods.service';
import { MethodsController } from './methods.controller';
import { PrismaModule } from 'src/prisma.module';
import { ShopsModule } from 'src/shops/shops.module';

@Module({
  imports: [PrismaModule, ShopsModule],
  exports: [MethodsService],
  controllers: [MethodsController],
  providers: [MethodsService],
})
export class MethodsModule {}
