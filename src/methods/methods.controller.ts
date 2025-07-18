import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { MethodsService } from './methods.service';
import { AuthGuard, RoleGuard, ShopGuard } from 'src/auth/auth.guard';
import { CreateMethodDto } from './dto/create-method.dto';
import { UpdateMethodDto } from './dto/update-method.dto';
import { UserRole } from 'src/enums/user';

@Controller('methods')
export class MethodsController {
  constructor(private readonly methodsService: MethodsService) {}

  @UseGuards(
    AuthGuard,
    new RoleGuard([UserRole.ADMIN, UserRole.MANAGER, UserRole.GREETER]),
    ShopGuard,
  )
  @Post()
  create(
    @Req() request: Request,
    @Body(new ValidationPipe()) createMethodDto: CreateMethodDto,
  ) {
    return this.methodsService.create(request, createMethodDto);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Get()
  findAll(@Req() request: Request) {
    return this.methodsService.findAll(request);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Get(':id')
  findOne(@Req() request: Request, @Param('id') id: string) {
    return this.methodsService.findOne(request, id);
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
    @Body(new ValidationPipe()) updateMethodDto: UpdateMethodDto,
  ) {
    return this.methodsService.update(request, id, updateMethodDto);
  }

  @UseGuards(AuthGuard, new RoleGuard([UserRole.ADMIN]), ShopGuard)
  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    return this.methodsService.remove(request, id);
  }
}
