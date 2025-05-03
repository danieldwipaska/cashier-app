import { PartialType } from '@nestjs/mapped-types';
import { CreateBackofficeSettingDto } from './create-backoffice-setting.dto';

export class UpdateBackofficeSettingDto extends PartialType(
  CreateBackofficeSettingDto,
) {}
