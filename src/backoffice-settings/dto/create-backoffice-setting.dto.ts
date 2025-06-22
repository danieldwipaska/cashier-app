import { CrewPurchaseCategory } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CreateBackofficeSettingDto {
  @IsUUID()
  @IsString()
  shop_id: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CrewPurchaseCategoryDto)
  readonly crewPurchaseCategories: CrewPurchaseCategory[];
}

export class CrewPurchaseCategoryDto {
  @IsUUID()
  @IsString()
  @IsOptional()
  backoffice_setting_id?: string;

  @IsUUID()
  @IsString()
  @IsOptional()
  category_id?: string;
}
