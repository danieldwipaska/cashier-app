import { PartialType } from '@nestjs/mapped-types';
import { CreateFnbModifierDto } from './create-fnb-modifier.dto';

export class UpdateFnbModifierDto extends PartialType(CreateFnbModifierDto) {}
