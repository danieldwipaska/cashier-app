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
  Req,
} from '@nestjs/common';
import { CrewsService } from './crews.service';
import { Prisma } from '@prisma/client';
import { AuthGuard, ShopGuard } from 'src/auth/auth.guard';
import { UpdateCrewDto } from './dto/update-crew.dto';

@Controller('crews')
export class CrewsController {
  constructor(private readonly crewsService: CrewsService) {}

  @UseGuards(AuthGuard, ShopGuard)
  @Post()
  create(@Body() data: Prisma.CrewCreateInput, @Request() req) {
    return this.crewsService.create(data, req.user.username, req.shop.id);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Get()
  findAll(@Req() request: Request) {
    return this.crewsService.findAll(request);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Get(':id')
  findOne(@Req() request: Request, @Param('id') id: string) {
    return this.crewsService.findOne(request, id);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Post('code')
  findOneByCode(@Req() request: Request, @Body('code') code: string) {
    return this.crewsService.findOneByCode(request, code);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Patch(':id')
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateCrewDto: UpdateCrewDto,
  ) {
    return this.crewsService.update(request, id, updateCrewDto);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    return this.crewsService.remove(request, id);
  }
}
