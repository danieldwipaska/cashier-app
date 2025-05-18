import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Position } from 'src/enums/crew';

export class CreateCrewDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(8, { message: 'Crew code cannot be longer than 8 characters' })
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
}
