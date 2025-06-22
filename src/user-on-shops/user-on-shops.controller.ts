import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UserOnShopsService } from './user-on-shops.service';
import { CreateUserOnShopDto } from './dto/create-user-on-shop.dto';
import { UpdateUserOnShopDto } from './dto/update-user-on-shop.dto';
import { ValidationPipe } from 'src/validation.pipe';

@Controller('user-on-shops')
export class UserOnShopsController {
  constructor(private readonly userOnShopsService: UserOnShopsService) {}

  @Post()
  create(
    @Body(new ValidationPipe()) createUserOnShopDto: CreateUserOnShopDto,
    @Req() request: Request,
  ) {
    return this.userOnShopsService.create(request, createUserOnShopDto);
  }

  @Get()
  findAll(@Req() request: Request) {
    return this.userOnShopsService.findAll(request);
  }

  @Patch(':shop_id/:user_id')
  update(
    @Param('shop_id') shop_id: string,
    @Param('user_id') user_id: string,
    @Body(new ValidationPipe()) updateUserOnShopDto: UpdateUserOnShopDto,
    @Req() request: Request,
  ) {
    return this.userOnShopsService.update(
      request,
      shop_id,
      user_id,
      updateUserOnShopDto,
    );
  }

  @Delete()
  removeMany(
    @Body() updateUserOnShopDto: UpdateUserOnShopDto,
    @Req() request: Request,
  ) {
    return this.userOnShopsService.removeMany(request, updateUserOnShopDto);
  }

  @Delete(':shop_id/:user_id')
  remove(
    @Param('shop_id') shop_id: string,
    @Param('user_id') user_id: string,
    @Req() request: Request,
  ) {
    return this.userOnShopsService.remove(request, user_id, shop_id);
  }
}
