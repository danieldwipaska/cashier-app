import { IsString, IsUUID } from 'class-validator';

export class CreateUserOnShopDto {
  @IsString()
  @IsUUID()
  user_id: string;

  @IsString()
  @IsUUID()
  shop_id: string;
}
