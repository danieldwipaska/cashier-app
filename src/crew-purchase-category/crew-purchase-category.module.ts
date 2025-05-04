import { Module } from '@nestjs/common';
import { CrewPurchaseCategoryService } from './crew-purchase-category.service';
import { CrewPurchaseCategoryController } from './crew-purchase-category.controller';
import { PrismaModule } from 'src/prisma.module';

@Module({
  controllers: [CrewPurchaseCategoryController],
  providers: [CrewPurchaseCategoryService],
  imports: [PrismaModule],
})
export class CrewPurchaseCategoryModule {}
