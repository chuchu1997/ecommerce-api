import { PartialType } from '@nestjs/mapped-types';
import { CreateProductSizeDto } from './create-product-size.dto';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductSizeDto extends PartialType(CreateProductSizeDto) {
  @IsNotEmpty()
  @IsInt({ message: 'ID của Product Size phải là Number !!! ' })
  @Transform(({ value }) => (isNaN(Number(value)) ? undefined : Number(value)))
  id: number;
}
