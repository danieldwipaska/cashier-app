import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ShopsService } from './shops.service';
import { Prisma } from '@prisma/client';
import { AuthGuard, ShopGuard } from 'src/auth/auth.guard';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  create(@Body() data: Prisma.ShopCreateInput) {
    return this.shopsService.create(data);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.shopsService.findAll();
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Get('shop')
  findOneByCode(@Req() request: any) {
    return this.shopsService.findOneByCode(request.shop.code);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.ShopUpdateInput) {
    return this.shopsService.update(id, data);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopsService.remove(id);
  }
}
