import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PromotionType } from '@prisma/client';

/**
 * DTO for order filter parameters
 */
export class PromotionQueryDto {
  @IsNumber()
  @Transform(({ value }) =>
    value !== undefined ? parseInt(value, 10) : undefined,
  )
  storeID: number;

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
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive: boolean;

  @IsOptional()
  @IsEnum(PromotionType)
  promotionType: PromotionType;
}
