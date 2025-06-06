import { PartialType } from '@nestjs/swagger';
import { CreateBannerDTO } from './create-banner.dto';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateBannerDto extends PartialType(CreateBannerDTO) {
  @IsOptional()
  updatedAt?: string | undefined;
}
