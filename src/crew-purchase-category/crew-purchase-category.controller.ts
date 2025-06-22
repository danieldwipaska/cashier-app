import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
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
    @Req() request: any,
  ) {
    return this.crewPurchaseCategoryService.create(
      request,
      createCrewPurchaseCategoryDto,
    );
  }

  @Get()
  findAll(
    @Query('backoffices_setting_id') backoffices_setting_id: string,
    @Req() request: any,
  ) {
    return this.crewPurchaseCategoryService.findAll(
      request,
      backoffices_setting_id,
    );
  }

  @Delete('')
  remove(
    @Body('backoffice_setting_id') backoffice_setting_id: string,
    @Body('category_id') category_id: string,
    @Req() request: any,
  ) {
    return this.crewPurchaseCategoryService.remove(
      request,
      backoffice_setting_id,
      category_id,
    );
  }
}
