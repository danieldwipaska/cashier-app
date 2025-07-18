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
import { AuthGuard, RoleGuard, ShopGuard } from 'src/auth/auth.guard';
import { CreateFnbDto } from './dto/create-fnb.dto';
import { UpdateFnbDto } from './dto/update-fnb.dto';
import { UserRole } from 'src/enums/user';

@Controller('fnbs')
export class FnbsController {
  constructor(private readonly fnbsService: FnbsService) {}

  @UseGuards(
    AuthGuard,
    new RoleGuard([UserRole.ADMIN, UserRole.MANAGER, UserRole.GREETER]),
    ShopGuard,
  )
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

  @UseGuards(
    AuthGuard,
    new RoleGuard([UserRole.ADMIN, UserRole.MANAGER, UserRole.GREETER]),
    ShopGuard,
  )
  @Patch(':id')
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateFnbDto: UpdateFnbDto,
  ) {
    return this.fnbsService.update(request, id, updateFnbDto);
  }

  @UseGuards(AuthGuard, new RoleGuard([UserRole.ADMIN]), ShopGuard)
  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    return this.fnbsService.remove(request, id);
  }
}
