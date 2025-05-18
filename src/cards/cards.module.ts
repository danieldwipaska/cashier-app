import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { PrismaModule } from 'src/prisma.module';
import { CrewsModule } from 'src/crews/crews.module';
import { ShopsModule } from 'src/shops/shops.module';

@Module({
  imports: [PrismaModule, CrewsModule, ShopsModule],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
