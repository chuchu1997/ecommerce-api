import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNotEmpty()
  @IsInt({ message: 'ID của Product phải là Number !!! ' })
  @Transform(({ value }) => (isNaN(Number(value)) ? undefined : Number(value)))
  id: number;

  @IsNotEmpty({ message: 'Ngày tạo Product không được bỏ trống ' })
  createdAt?: string | undefined;
  @IsNotEmpty({ message: 'Thời gian Cập nhật  Product không được bỏ trống ' })
  updatedAt?: string | undefined;
}
