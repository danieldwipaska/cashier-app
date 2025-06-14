import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { CrewPurchaseCategoryService } from './crew-purchase-category.service';
import { CreateCrewPurchaseCategoryDto } from './dto/create-crew-purchase-category.dto';
import { ValidationPipe } from 'src/validation.pipe';

@Controller('crew-purchase-category')
export class CrewPurchaseCategoryController {
  constructor(
    private readonly crewPurchaseCategoryService: CrewPurchaseCategoryService,
  ) {}

  @Post()
  create(
    @Body(new ValidationPipe())
    createCrewPurchaseCategoryDto: CreateCrewPurchaseCategoryDto,
  ) {
    return this.crewPurchaseCategoryService.create(
      createCrewPurchaseCategoryDto,
    );
  }

  @Get()
  findAll(@Query('backoffices_setting_id') backoffices_setting_id: string) {
    return this.crewPurchaseCategoryService.findAll(backoffices_setting_id);
  }

  @Delete('')
  remove(
    @Body('backoffice_setting_id') backoffice_setting_id: string,
    @Body('category_id') category_id: string,
  ) {
    return this.crewPurchaseCategoryService.remove(
      backoffice_setting_id,
      category_id,
    );
  }
}
