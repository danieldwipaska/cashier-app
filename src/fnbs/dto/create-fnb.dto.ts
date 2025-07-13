import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateFnbDto {
  @IsString()
  @MaxLength(30)
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsUUID()
  category_id: string;

  @IsArray()
  @IsOptional()
  readonly fnbModifiers?: FnbModifierDto[];
}

export class FnbModifierDto {
  @IsUUID()
  @IsString()
  @IsOptional()
  modifier_id?: string;

  @IsUUID()
  @IsString()
  @IsOptional()
  fnb_id?: string;
}
