import { PartialType } from '@nestjs/mapped-types';
import { CreateUserOnShopDto } from './create-user-on-shop.dto';

export class UpdateUserOnShopDto extends PartialType(CreateUserOnShopDto) {}
