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
} from '@nestjs/common';
import { FnbsService } from './fnbs.service';
import { Prisma } from '@prisma/client';

@Controller('fnbs')
export class FnbsController {
  constructor(private readonly fnbsService: FnbsService) {}

  @Post()
  create(@Body() data: Prisma.FnbsCreateInput) {
    return this.fnbsService.create(data);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pagination', new DefaultValuePipe(true), ParseBoolPipe)
    pagination?: boolean,
  ) {
    return this.fnbsService.findAll(page, pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fnbsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.FnbsUpdateInput) {
    return this.fnbsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fnbsService.remove(id);
  }
}
