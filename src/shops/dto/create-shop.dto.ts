import { IsString, MaxLength } from 'class-validator';

export class CreateShopDto {
  @IsString()
  @MaxLength(20, {
    message: 'Shop Code cannot be longer than 20 characters',
  })
  code: string;

  @IsString()
  @MaxLength(50, {
    message: 'Shop name cannot be longer than 50 characters',
  })
  name: string;
}
