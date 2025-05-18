import { PartialType } from '@nestjs/mapped-types';
import { CreateFnbDto } from './create-fnb.dto';

export class UpdateFnbDto extends PartialType(CreateFnbDto) {}
