import { IsString, IsUUID } from 'class-validator';

export class CreateCrewPurchaseCategoryDto {
  @IsString()
  @IsUUID()
  backoffice_setting_id: string;

  @IsString()
  @IsUUID()
  category_id: string;
}
