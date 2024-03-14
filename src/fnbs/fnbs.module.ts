import { Module } from '@nestjs/common';
import { FnbsService } from './fnbs.service';
import { FnbsController } from './fnbs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Fnb, FnbSchema } from './entities/fnb.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Fnb.name, schema: FnbSchema }])],
  controllers: [FnbsController],
  providers: [FnbsService],
})
export class FnbsModule {}
