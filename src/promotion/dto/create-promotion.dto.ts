import { DiscountType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PromotionProductDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  discount: number;

  @IsEnum(DiscountType)
  discountType: DiscountType;
}

export class CreatePromotionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PromotionProductDto)
  promotionProducts: PromotionProductDto[];

  @IsNumber()
  storeId: number;
}
