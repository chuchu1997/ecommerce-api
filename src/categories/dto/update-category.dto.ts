import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty } from 'class-validator';

import { CreateCategoryDto } from './create-category.dto';
import { Transform } from 'class-transformer';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsNotEmpty()
  @IsInt({ message: 'ID của danh mục phải là kiểu Number ' })
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  id: number;
}
