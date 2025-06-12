import { IsOptional, IsBoolean, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * DTO for order filter parameters
 */
export class CategoryQueryFilterDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  storeID: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  justGetParent?: boolean; // Filter orders created within the current month

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  currentPage: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  limit: number;
}
