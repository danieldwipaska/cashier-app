import { Module } from '@nestjs/common';
import { ModifiersService } from './modifiers.service';
import { ModifiersController } from './modifiers.controller';
import { PrismaModule } from 'src/prisma.module';
import { ShopsModule } from 'src/shops/shops.module';

@Module({
  controllers: [ModifiersController],
  providers: [ModifiersService],
  imports: [PrismaModule, ShopsModule],
})
export class ModifiersModule {}
