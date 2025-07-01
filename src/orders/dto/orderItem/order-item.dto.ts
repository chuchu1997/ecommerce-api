import { DiscountType, PaymentMethod, PaymentStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderGiftItemDto } from './order-gift-item.dto';

export class OrderItemDTO {
  @IsNotEmpty({ message: 'Bắt buộc phải có ProductID trong orderItem' })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  unitPrice: number; // GIÁ TẠI THỜI ĐIỂM ĐÓ KHI ÁP DỤNG VOUCHER

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  subtotal: number; // TỔNG TIỀN CHO SẢN PHẨM NÀY !!!

  @IsOptional()
  promotionName?: string;
  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType; // Loại khuyến mãi: "PERCENT" hoặc "FIXED"

  @IsOptional()
  @IsNumber()
  discountValue?: number; // Giá trị khuyến mãi: ví dụ 10 (%) hoặc 50000

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderGiftItemDto)
  giftItems?: OrderGiftItemDto[];

  @IsNotEmpty({ message: 'Tổng số lượng ' })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  quantity: number;
}
