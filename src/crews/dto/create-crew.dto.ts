import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Position } from 'src/enums/crew';

export class CreateCrewDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(12, { message: 'Crew name cannot be longer than 12 characters' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(8, { message: 'Crew code cannot be longer than 8 characters' })
  @MinLength(6, { message: 'Crew code cannot be shorter than 6 characters' })
  code: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Position)
  position: Position;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
