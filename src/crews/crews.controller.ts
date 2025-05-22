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
  ValidationPipe,
} from '@nestjs/common';
import { CrewsService } from './crews.service';
import { AuthGuard, ShopGuard } from 'src/auth/auth.guard';
import { UpdateCrewDto } from './dto/update-crew.dto';
import { CreateCrewDto } from './dto/create-crew.dto';

@Controller('crews')
export class CrewsController {
  constructor(private readonly crewsService: CrewsService) {}

  @UseGuards(AuthGuard, ShopGuard)
  @Post()
  create(
    @Body(new ValidationPipe()) createCrewDto: CreateCrewDto,
    @Request() req,
  ) {
    return this.crewsService.create(
      createCrewDto,
      req.user.username,
      req.shop.id,
    );
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
    @Body(new ValidationPipe()) updateCrewDto: UpdateCrewDto,
  ) {
    return this.crewsService.update(request, id, updateCrewDto);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    return this.crewsService.remove(request, id);
  }
}
