import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MethodsService } from './methods.service';
import { Prisma } from '@prisma/client';

@Controller('methods')
export class MethodsController {
  constructor(private readonly methodsService: MethodsService) {}

  @Post()
  create(@Body() data: Prisma.MethodCreateInput) {
    return this.methodsService.create(data);
  }

  @Get()
  findAll() {
    return this.methodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.methodsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.MethodUpdateInput) {
    return this.methodsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.methodsService.remove(id);
  }
}
