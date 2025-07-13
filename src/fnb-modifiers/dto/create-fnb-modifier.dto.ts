import { IsString, IsUUID } from 'class-validator';

export class CreateFnbModifierDto {
  @IsString()
  @IsUUID()
  fnb_id: string;

  @IsString()
  @IsUUID()
  modifier_id: string;
}
