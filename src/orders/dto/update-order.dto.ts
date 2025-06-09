import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDTO } from './create-order.dto';
import { OrderStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDTO) {
  @IsNotEmpty({ message: 'Trạng thái Order không được bỏ trống !' })
  @IsEnum(OrderStatus)
  status: OrderStatus;
  @IsNotEmpty({ message: 'Thời gian Cập nhật  Order không được bỏ trống ' })
  updatedAt?: string | undefined;
}
