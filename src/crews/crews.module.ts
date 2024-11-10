import { Module } from '@nestjs/common';
import { CrewsService } from './crews.service';
import { CrewsController } from './crews.controller';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [CrewsService],
  controllers: [CrewsController],
  providers: [CrewsService],
})
export class CrewsModule {}
