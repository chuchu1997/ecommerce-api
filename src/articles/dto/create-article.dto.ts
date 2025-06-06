import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Tên sản phẩm phải có ít nhất 3 ký tự' })
  @MaxLength(200, { message: 'Tên sản phẩm không được vượt quá 200 ký tự' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug chỉ được chứa chữ thường, số, và dấu gạch ngang',
  })
  @MaxLength(250, { message: 'Slug không được vượt quá 250 ký tự' })
  @Transform(({ value, obj }) => {
    // If no slug is provided, generate one from the name
    if (!value && obj.name) {
      return obj.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (for Vietnamese)
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Remove consecutive hyphens
    }
    return value;
  })
  slug: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Mô tả phải có ít nhất 10 ký tự' })
  description: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'URL hình ảnh sai' })
  imageUrl: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  storeId: number;
}
