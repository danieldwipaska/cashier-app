import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { PrismaModule } from 'src/prisma.module';
import { CrewsModule } from 'src/crews/crews.module';

@Module({
  imports: [PrismaModule, CrewsModule],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
