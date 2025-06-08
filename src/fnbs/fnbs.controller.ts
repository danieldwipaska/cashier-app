import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  ParseBoolPipe,
  UseGuards,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { FnbsService } from './fnbs.service';
import { Prisma } from '@prisma/client';
import { AuthGuard, ShopGuard } from 'src/auth/auth.guard';
import { CreateFnbDto } from './dto/create-fnb.dto';

@Controller('fnbs')
export class FnbsController {
  constructor(private readonly fnbsService: FnbsService) {}

  @UseGuards(AuthGuard, ShopGuard)
  @Post()
  create(
    @Req() request: Request,
    @Body(new ValidationPipe()) data: CreateFnbDto,
  ) {
    return this.fnbsService.create(request, data);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Get()
  findAll(
    @Req() request: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pagination', new DefaultValuePipe(true), ParseBoolPipe)
    pagination?: boolean,
  ) {
    return this.fnbsService.findAll(request, page, pagination);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Get(':id')
  findOne(@Req() request: Request, @Param('id') id: string) {
    return this.fnbsService.findOne(request, id);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Patch(':id')
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() data: Prisma.FnbsUpdateInput,
  ) {
    return this.fnbsService.update(request, id, data);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    return this.fnbsService.remove(request, id);
  }
}
