import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserOnShopsService } from './user-on-shops.service';
import { CreateUserOnShopDto } from './dto/create-user-on-shop.dto';
import { UpdateUserOnShopDto } from './dto/update-user-on-shop.dto';
import { ValidationPipe } from 'src/validation.pipe';

@Controller('user-on-shops')
export class UserOnShopsController {
  constructor(private readonly userOnShopsService: UserOnShopsService) {}

  @Post()
  create(@Body(new ValidationPipe()) createUserOnShopDto: CreateUserOnShopDto) {
    return this.userOnShopsService.create(createUserOnShopDto);
  }

  @Get()
  findAll() {
    return this.userOnShopsService.findAll();
  }

  @Patch(':shop_id/:user_id')
  update(
    @Param('shop_id') shop_id: string,
    @Param('user_id') user_id: string,
    @Body(new ValidationPipe()) updateUserOnShopDto: UpdateUserOnShopDto,
  ) {
    return this.userOnShopsService.update(
      shop_id,
      user_id,
      updateUserOnShopDto,
    );
  }

  @Delete()
  removeMany(@Body() updateUserOnShopDto: UpdateUserOnShopDto) {
    return this.userOnShopsService.removeMany(updateUserOnShopDto);
  }

  @Delete(':shop_id/:user_id')
  remove(@Param('shop_id') shop_id: string, @Param('user_id') user_id: string) {
    return this.userOnShopsService.remove(user_id, shop_id);
  }
}
