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
import { AuthGuard, RoleGuard, ShopGuard } from 'src/auth/auth.guard';
import { UpdateCrewDto } from './dto/update-crew.dto';
import { CreateCrewDto } from './dto/create-crew.dto';
import { UserRole } from 'src/enums/user';

@Controller('crews')
export class CrewsController {
  constructor(private readonly crewsService: CrewsService) {}

  @UseGuards(
    AuthGuard,
    new RoleGuard([UserRole.ADMIN, UserRole.MANAGER]),
    ShopGuard,
  )
  @Post()
  create(
    @Body(new ValidationPipe()) createCrewDto: CreateCrewDto,
    @Req() request: Request,
  ) {
    return this.crewsService.create(request, createCrewDto);
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

  @UseGuards(
    AuthGuard,
    new RoleGuard([UserRole.ADMIN, UserRole.MANAGER]),
    ShopGuard,
  )
  @Patch(':id')
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateCrewDto: UpdateCrewDto,
  ) {
    return this.crewsService.update(request, id, updateCrewDto);
  }

  @UseGuards(
    AuthGuard,
    new RoleGuard([UserRole.ADMIN, UserRole.MANAGER]),
    ShopGuard,
  )
  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    return this.crewsService.remove(request, id);
  }
}
