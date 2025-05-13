import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class OrderItemDTO {
  @IsOptional()
  @IsInt({ message: 'ID OrderItem phải là Number !!! ' })
  @Transform(({ value }) => parseInt(value, 10))
  id: number;

  @IsNotEmpty({ message: 'Bắt buộc phải có OrderID trong orderItem' })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  orderId: number;

  @IsNotEmpty({ message: 'Bắt buộc phải có ProductID trong orderItem' })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  unitPrice: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  subtotal: number; // Tổng giá của sản phẩm (quantity * unitPrice)

  @IsNotEmpty({ message: 'Tổng số lượng ' })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  quantity: number;
}
