import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDTO } from './create-order.dto';
import { OrderStatus } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateOrderDto extends PartialType(CreateOrderDTO) {
  @IsOptional()
  @IsInt({ message: 'ID Order phải là Number !!! ' })
  @Transform(({ value }) => parseInt(value, 10))
  id: number;

  @IsNotEmpty({ message: 'Trạng thái Order không được bỏ trống !' })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
