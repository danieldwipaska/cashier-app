import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma.module';
import { CrewsModule } from 'src/crews/crews.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'thisissecret',
      signOptions: { expiresIn: '1d' },
    }),
    PrismaModule,
    CrewsModule,
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
