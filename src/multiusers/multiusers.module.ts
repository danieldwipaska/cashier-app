import { Module } from '@nestjs/common';
import { MultiusersService } from './multiusers.service';
import { MultiusersController } from './multiusers.controller';
import { PrismaModule } from 'src/prisma.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [MultiusersController],
  providers: [MultiusersService],
})
export class MultiusersModule {}
