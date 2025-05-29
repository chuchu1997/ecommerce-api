import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateStoreDto {
  // Tên sản phẩm
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Tên sản phẩm phải có ít nhất 3 ký tự' })
  @MaxLength(200, { message: 'Tên sản phẩm không được vượt quá 200 ký tự' })
  name: string;
  // Mô tả sản phẩm

  // Giá sản phẩm
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  userID: number;

  //CÁC SẢN PHẨM THUỘC VỀ STORE NÀY !!
}
