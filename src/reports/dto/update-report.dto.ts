import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ReportStatus } from 'src/enums/report';

export class UpdateReportDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Customer cannot be longer than 50 characters' })
  @MinLength(2, { message: 'Customer cannot be shorter than 2 characters' })
  readonly customer_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Customer cannot be longer than 50 characters' })
  @MinLength(2, { message: 'Customer cannot be shorter than 2 characters' })
  readonly payment_method: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Order ID cannot be empty' })
  @ArrayMaxSize(50, { message: 'Order ID cannot be more than 50' })
  @IsUUID(4, { each: true, message: 'Order ID must be a valid UUID' })
  readonly order_id: string[];

  @IsArray()
  @ArrayMinSize(1, { message: 'Order ID cannot be empty' })
  @ArrayMaxSize(50, { message: 'Order ID cannot be more than 50' })
  @IsNumber({}, { each: true })
  @Min(0, { each: true, message: 'Order ID must be a positive number' })
  @Max(100, { each: true, message: 'Order ID must be less than 100' })
  readonly order_amount: number[];

  @IsUUID(4, { message: 'Crew ID must be a valid UUID' })
  @IsNotEmpty()
  readonly crew_id: string;

  @IsString()
  @IsOptional()
  @IsEnum(ReportStatus)
  readonly status: ReportStatus;

  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'Note cannot be longer than 255 characters' })
  readonly note: string;
}
