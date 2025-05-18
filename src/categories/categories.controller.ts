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
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard, ShopGuard } from 'src/auth/auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthGuard, ShopGuard)
  @Post()
  create(
    @Req() request: Request,
    @Body() createCategoryDto: CreateCategoryDto,
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

  @UseGuards(AuthGuard, ShopGuard)
  @Patch(':id')
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(request, id, updateCategoryDto);
  }

  @UseGuards(AuthGuard, ShopGuard)
  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    return this.categoriesService.remove(request, id);
  }
}
