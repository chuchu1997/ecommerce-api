import { IsOptional, IsBoolean, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * DTO for order filter parameters
 */
export class BannerFilterDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  storeID: number;
}
