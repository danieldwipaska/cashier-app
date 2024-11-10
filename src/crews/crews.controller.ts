import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CrewsService } from './crews.service';
import { Prisma } from '@prisma/client';

@Controller('crews')
export class CrewsController {
  constructor(private readonly crewsService: CrewsService) {}

  @Post()
  create(@Body() data: Prisma.CrewCreateInput) {
    return this.crewsService.create(data);
  }

  @Get()
  findAll() {
    return this.crewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.crewsService.findOne(id);
  }

  @Post('code')
  findOneByCode(@Body('code') code: string) {
    return this.crewsService.findOneByCode(code);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.CrewUpdateInput) {
    return this.crewsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.crewsService.remove(id);
  }
}
