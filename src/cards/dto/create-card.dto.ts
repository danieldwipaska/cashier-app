import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCardDto {
  @IsBoolean()
  @IsNotEmpty()
  readonly is_member: boolean;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Card number cannot be longer than 50 characters' })
  @MinLength(5, { message: 'Card number cannot be shorter than 5 characters' })
  readonly card_number: string;
}
