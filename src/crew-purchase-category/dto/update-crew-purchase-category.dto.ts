import { PartialType } from '@nestjs/mapped-types';
import { CreateCrewPurchaseCategoryDto } from './create-crew-purchase-category.dto';

export class UpdateCrewPurchaseCategoryDto extends PartialType(CreateCrewPurchaseCategoryDto) {}
