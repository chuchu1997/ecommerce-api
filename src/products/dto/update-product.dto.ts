import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNotEmpty()
  @IsInt({ message: 'ID của Product phải là Number !!! ' })
  @Transform(({ value }) => (isNaN(Number(value)) ? undefined : Number(value)))
  id: number;

  @IsOptional()
  updatedAt?: string | undefined;
}
