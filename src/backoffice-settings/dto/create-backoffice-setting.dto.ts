import { IsString, IsUUID } from 'class-validator';

export class CreateBackofficeSettingDto {
  @IsUUID()
  @IsString()
  shop_id: string;
}
