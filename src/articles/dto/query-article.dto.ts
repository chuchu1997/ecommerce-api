import { IsOptional, IsBoolean, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * DTO for order filter parameters
 */
export class ArticleQueryFilterDto {
  @IsNumber()
  @Transform(({ value }) =>
    value !== undefined ? parseInt(value, 10) : undefined,
  )
  storeId: number;

  @IsNumber()
  @Transform(({ value }) =>
    value !== undefined ? parseInt(value, 10) : undefined,
  )
  currentPage: number;

  @IsNumber()
  @Transform(({ value }) =>
    value !== undefined ? parseInt(value, 10) : undefined,
  )
  limit: number;

  @IsOptional()
  @IsString()
  slug: string;
}
