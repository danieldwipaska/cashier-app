import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FnbsModule } from './fnbs/fnbs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { ReportsModule } from './reports/reports.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { CardsModule } from './cards/cards.module';
import { CrewsModule } from './crews/crews.module';
import { ShopsModule } from './shops/shops.module';
import { MultiusersModule } from './multiusers/multiusers.module';
import { MethodsModule } from './methods/methods.module';

@Module({
  imports: [
    FnbsModule,
    CategoriesModule,
    ReportsModule,
    AuthModule,
    UsersModule,
    ConfigModule.forRoot(),
    CardsModule,
    CrewsModule,
    ShopsModule,
    MultiusersModule,
    MethodsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
