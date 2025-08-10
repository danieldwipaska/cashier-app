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
import { CategoriesService } from './categories.service';
import { AuthGuard, RoleGuard, ShopGuard } from 'src/auth/auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UserRole } from 'src/enums/user';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthGuard, ShopGuard)
  @Post()
  create(
    @Req() request: Request,
    @Body(new ValidationPipe()) createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(request, createCategoryDto);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Get()
  findAll(@Req() request: Request) {
    return this.categoriesService.findAll(request);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Get(':name')
  findOne(@Req() request: Request, @Param('name') name: string) {
    return this.categoriesService.findOne(request, name);
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
    @Body(new ValidationPipe()) updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(request, id, updateCategoryDto);
  }

  @UseGuards(
    AuthGuard,
    new RoleGuard([UserRole.ADMIN, UserRole.GREETER, UserRole.MANAGER]),
    ShopGuard,
  )
  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    return this.categoriesService.remove(request, id);
  }
}
