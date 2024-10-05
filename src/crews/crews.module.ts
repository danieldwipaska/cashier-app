import { Module } from '@nestjs/common';
import { CrewsService } from './crews.service';
import { CrewsController } from './crews.controller';
import { PrismaModule } from 'src/prisma.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  exports: [CrewsService],
  controllers: [CrewsController],
  providers: [CrewsService],
})
export class CrewsModule {}
