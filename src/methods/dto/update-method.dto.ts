import { PartialType } from '@nestjs/mapped-types';
import { CreateMethodDto } from './create-method.dto';

export class UpdateMethodDto extends PartialType(CreateMethodDto) {}
