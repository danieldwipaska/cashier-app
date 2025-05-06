import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShopsService } from './shops.service';
import { Prisma } from '@prisma/client';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  create(@Body() data: Prisma.ShopCreateInput) {
    return this.shopsService.create(data);
  }

  @Get()
  findAll() {
    return this.shopsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopsService.findOne(id);
  }

  @Get('shop/:code')
  findOneByCode(@Param('code') code: string) {
    return this.shopsService.findOneByCode(code);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.ShopUpdateInput) {
    return this.shopsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopsService.remove(id);
  }
}
