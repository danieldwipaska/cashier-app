import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FnbsModule } from './fnbs/fnbs.module';
import { CategoriesModule } from './categories/categories.module';
import { ReportsModule } from './reports/reports.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { CardsModule } from './cards/cards.module';
import { CrewsModule } from './crews/crews.module';
import { ShopsModule } from './shops/shops.module';
import { MethodsModule } from './methods/methods.module';
import { BackofficeSettingsModule } from './backoffice-settings/backoffice-settings.module';
import { CrewPurchaseCategoryModule } from './crew-purchase-category/crew-purchase-category.module';
import { UserOnShopsModule } from './user-on-shops/user-on-shops.module';
import { LoggerModule } from './loggers/logger.module';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { ModifiersModule } from './modifiers/modifiers.module';
import { FnbModifiersModule } from './fnb-modifiers/fnb-modifiers.module';

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
    MethodsModule,
    BackofficeSettingsModule,
    CrewPurchaseCategoryModule,
    UserOnShopsModule,
    LoggerModule,
    ModifiersModule,
    FnbModifiersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*'); // Terapkan middleware ke semua rute
  }
}
