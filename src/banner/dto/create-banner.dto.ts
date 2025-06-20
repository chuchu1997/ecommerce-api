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
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

class CTA {
  @IsNotEmpty({ message: 'Tiêu đề CTA không được để trống' })
  @IsString({ message: 'Tiêu đề CTA phải là chuỗi' })
  title: string;

  @IsNotEmpty({ message: 'Link CTA không được để trống' })
  @IsString({ message: 'Link CTA phải là chuỗi' })
  link: string;
}

export class CreateBannerDTO {
  @IsNotEmpty({ message: 'Không được bỏ trống đường dẫn hình ảnh !!' })
  imageUrl: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  storeId: number;

  @IsOptional()
  @IsString({ message: 'Link phải là kiểu chuỗi' })
  link?: string;

  @IsOptional()
  @IsString({ message: 'Tiêu đề phải là kiểu chuỗi' })
  @MaxLength(255, { message: 'Tiêu đề không được vượt quá 255 ký tự' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Mô tả phải là kiểu chuỗi' })
  @MaxLength(8000, { message: 'Mô tả không thể vượt quá 8000 ký tự' })
  description?: string;

  @IsInt({ message: 'Position phải là kiểu Number' })
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  position: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? true : value)) // Mặc định isActive là true
  isActive?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => CTA)
  cta?: CTA;
}
