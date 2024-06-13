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
import { MultiusersService } from './multiusers.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('multiusers')
export class MultiusersController {
  constructor(private readonly multiusersService: MultiusersService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body()
    data: Prisma.UserCreateInput,
    @Request() req,
  ) {
    return this.multiusersService.create(req.user.username, data);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.multiusersService.findAll(req.user.username);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.multiusersService.findOne(id, req.user.username);
  }

  @UseGuards(AuthGuard)
  @Get('configuration/:username')
  findUserConfiguration(@Param('username') username: string) {
    return this.multiusersService.findUserConfiguration(username);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: Prisma.UserUpdateInput,
    @Request() req,
  ) {
    return this.multiusersService.update(id, data, req.user.username);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.multiusersService.remove(id, req.user.username);
  }
}
