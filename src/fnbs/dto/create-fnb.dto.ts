import { IsNumber, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateFnbDto {
  @IsString()
  @MaxLength(30)
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsUUID()
  category_id: string;
}
