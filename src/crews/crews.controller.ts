import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CrewsService } from './crews.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('crews')
export class CrewsController {
  constructor(private readonly crewsService: CrewsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() data: Prisma.CrewCreateInput, @Request() req) {
    return this.crewsService.create(data, req.user.username);
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
