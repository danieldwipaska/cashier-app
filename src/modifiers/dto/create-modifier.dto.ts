import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateModifierDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  code: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;
}
