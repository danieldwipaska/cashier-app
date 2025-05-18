import { IsString, MaxLength } from 'class-validator';

export class CreateMethodDto {
  @IsString()
  @MaxLength(50, {
    message: 'Payment method cannot be longer than 50 characters',
  })
  name: string;
}
