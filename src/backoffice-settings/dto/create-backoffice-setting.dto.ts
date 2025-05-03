// create-backoffice-setting.dto.ts
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateBackofficeSettingDto {
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  categoryIds?: string[];
}
