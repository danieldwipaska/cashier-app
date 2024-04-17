import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
  findAll() {
    return this.fnbsService.findAll();
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
