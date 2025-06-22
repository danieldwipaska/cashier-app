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
  create(@Body() data: Prisma.ShopCreateInput, @Req() request: Request) {
    return this.shopsService.create(request, data);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() request: Request) {
    return this.shopsService.findAll(request);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Get('shop')
  findOneByCode(@Req() request: any) {
    return this.shopsService.findOneByCode(request.shop.code);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: Request) {
    return this.shopsService.findOne(request, id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: Prisma.ShopUpdateInput,
    @Req() request: Request,
  ) {
    return this.shopsService.update(request, id, data);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.shopsService.remove(request, id);
  }
}
