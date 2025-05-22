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
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReportStatus } from 'src/enums/report';

export class ItemDto {
  @IsUUID(4, { message: 'Fnb ID must be a valid UUID' })
  @IsNotEmpty()
  readonly fnb_id: string;

  @IsNumber()
  @Min(1)
  readonly amount: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly refunded_amount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly discount_percent?: number;

  @IsNumber()
  @Min(0)
  readonly price: number;
}

export class UpdateReportDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Customer cannot be longer than 50 characters' })
  @MinLength(2, { message: 'Customer cannot be shorter than 2 characters' })
  readonly customer_name: string;

  @IsString()
  @IsUUID(4, { message: 'Payment Method must be a valid UUID' })
  @IsNotEmpty()
  @MaxLength(50, {
    message: 'Payment method cannot be longer than 50 characters',
  })
  @MinLength(2, {
    message: 'Payment method cannot be shorter than 2 characters',
  })
  readonly method_id: string;

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  readonly items: ItemDto[];
}
