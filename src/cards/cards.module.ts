import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { PrismaModule } from 'src/prisma.module';
import { CrewsModule } from 'src/crews/crews.module';
import { ShopsModule } from 'src/shops/shops.module';
import { MethodsModule } from 'src/methods/methods.module';

@Module({
  imports: [PrismaModule, CrewsModule, ShopsModule, MethodsModule],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
