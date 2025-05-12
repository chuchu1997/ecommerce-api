import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { CreateProductColorDto } from './create-product-color.dto';

export class UpdateProductColorDto extends PartialType(CreateProductColorDto) {
  @IsNotEmpty()
  @IsInt({ message: 'ID của Product Size phải là Number !!! ' })
  @Transform(({ value }) => (isNaN(Number(value)) ? undefined : Number(value)))
  id: number;
}
