import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  MinLength,
  MaxLength,
  Matches,
  ValidateNested,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { SEODto } from 'src/utils/seo.dto';
import { CategoryVariant } from '@prisma/client';

export class CreateCategoryDto {
  @IsNotEmpty()
  @MinLength(2, { message: 'Tên danh mục phải ít nhất 2 ký tự !!' })
  @MaxLength(100, { message: 'Tên không được vượt quá 100 ký tự ' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug chỉ có thể chứa chữ cái thường, chữ số và dấu gạch ngang',
  })
  @MaxLength(150, { message: 'Slug cannot exceed 150 characters' })
  @Transform(({ value, obj }) => {
    // If no slug is provided, generate one from the name
    if (!value && obj.name) {
      return obj.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Remove consecutive hyphens
    }
    return value;
  })
  slug: string;

  // Store ID
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  storeId: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SEODto)
  seo?: SEODto;

  @IsOptional()
  @IsEnum(CategoryVariant)
  variant?: CategoryVariant;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(8000, { message: 'Mô tả không thể vượt quá 8000 ký tự ' })
  description: string;

  @IsOptional()
  @IsInt({ message: 'ID của danh mục cha phải là kiểu Number ' })
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  parentId?: number;
}
