import { IsOptional, IsBoolean, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * DTO for order filter parameters
 */
export class ProductQueryFilterDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  storeID: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  currentPage: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  limit: number;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isFeatured?: boolean; // Filter orders created within the current month

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  categoryId?: number; // Filter canceled orders
}
