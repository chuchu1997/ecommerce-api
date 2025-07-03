import { OrderStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsEnum(OrderStatus, { message: 'Trạng thái không hợp lệ' })
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  status: OrderStatus;

  @IsOptional()
  @IsString()
  trackingCode?: string;
  // Không bắt buộc phải có updatedAt nếu không dùng
  updatedAt?: string;
}
