import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class ProductSizeDto {
  @IsOptional()
  @IsInt({ message: 'ID của Product Size phải là Number !!! ' })
  @Transform(({ value }) => parseInt(value, 10))
  id: number;

  @IsNotEmpty({ message: 'Tên không được để trống!' })
  name: string;

  @IsNotEmpty({ message: 'ProductID không được để trống!' })
  @IsInt({ message: 'ID của ProductID phải là một số nguyên!' })
  @Transform(({ value }) => (isNaN(Number(value)) ? undefined : Number(value)))
  productId: number;

  @IsOptional()
  @IsNumber({}, { message: 'Giá phải là một số!' })
  @Min(0, { message: 'Giá phải lớn hơn hoặc bằng 0!' })
  price?: number;

  @IsNotEmpty({ message: 'Số lượng không được để trống!' })
  @IsNumber({}, { message: 'Số lượng phải là một số!' })
  @Min(0, { message: 'Số lượng phải lớn hơn hoặc bằng 0!' })
  stock: number;
}
