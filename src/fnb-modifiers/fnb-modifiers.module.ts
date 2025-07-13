import { Module } from '@nestjs/common';
import { FnbModifiersService } from './fnb-modifiers.service';
import { FnbModifiersController } from './fnb-modifiers.controller';
import { PrismaModule } from 'src/prisma.module';
import { ShopsModule } from 'src/shops/shops.module';

@Module({
  controllers: [FnbModifiersController],
  providers: [FnbModifiersService],
  imports: [PrismaModule, ShopsModule],
})
export class FnbModifiersModule {}
