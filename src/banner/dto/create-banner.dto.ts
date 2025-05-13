import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  MinLength,
  MaxLength,
  Matches,
  IsUrl,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBannerDTO {
  @IsNotEmpty({ message: 'Không được bỏ trống đường dẫn hình ảnh !!' })
  @MinLength(2, { message: 'Tên danh mục phải ít nhất 2 ký tự !!' })
  @MaxLength(100, { message: 'Tên không được vượt quá 100 ký tự ' })
  imageUrl: string;

  @IsOptional()
  @IsString({ message: 'Link phải là kiểu chuỗi' })
  @IsUrl()
  link?: string;

  @IsOptional()
  @IsString({ message: 'Tiêu đề phải là kiểu chuỗi' })
  @MaxLength(255, { message: 'Tiêu đề không được vượt quá 255 ký tự' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Mô tả phải là kiểu chuỗi' })
  @MaxLength(8000, { message: 'Mô tả không thể vượt quá 8000 ký tự' })
  description?: string;

  @IsOptional()
  @IsInt({ message: 'Position phải là kiểu Number' })
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  position?: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? true : value)) // Mặc định isActive là true
  isActive?: boolean;
}
