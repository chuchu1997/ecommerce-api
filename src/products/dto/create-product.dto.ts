import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ProductColorDto } from './product-color/product-color.dto';
import { ProductSizeDto } from './product-size/product-size.dto';
import { SEODto } from 'src/utils/seo.dto';
import { GiftProductDTO } from './gift-product/gift-product.dto';
export class CreateProductDto {
  // Tên sản phẩm
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Tên sản phẩm phải có ít nhất 3 ký tự' })
  @MaxLength(200, { message: 'Tên sản phẩm không được vượt quá 200 ký tự' })
  name: string;
  // Mô tả sản phẩm
  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Mô tả phải có ít nhất 10 ký tự' })
  description: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Mô tả ngắn phải có ít nhất 10 ký tự' })
  shortDescription: string;

  //GIA CU
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  originalPrice: number;

  // Giá sản phẩm
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Giá không được âm' })
  @Transform(({ value }) => parseFloat(value))
  price: number;

  // Store ID
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  storeId: number;
  // Trạng thái nổi bật (featured) của sản phẩm

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isFeatured: boolean = false;

  // Slug cho sản phẩm
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

  // Giảm giá
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Giảm giá không được âm' })
  @Max(100, { message: 'Giảm giá không được vượt quá 100%' })
  @Transform(({ value }) => (value ? parseFloat(value) : 0))
  discount: number = 0;

  // Số lượt xem
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => (value ? parseInt(value, 10) : 0))
  viewCount?: number = 0;

  // Số lượt đánh giá

  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => (value ? parseInt(value, 10) : 0))
  ratingCount?: number = 0;

  // Màu sắc của sản phẩm
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductColorDto)
  @IsOptional()
  colors?: ProductColorDto[] = [];

  // Kích thước của sản phẩm

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSizeDto)
  @IsOptional()
  sizes?: ProductSizeDto[] = [];

  //SEO cho sản phẩm
  @IsOptional()
  seo?: JSON;

  // Số lượng trong kho
  @IsInt()
  @Min(0, { message: 'Số lượng không được âm' })
  @Transform(({ value }) => parseInt(value, 10))
  stock: number;

  // Ảnh của sản phẩm (URL hoặc base64)
  @IsArray()
  @ArrayMinSize(1, { message: 'Sản phẩm phải có ít nhất 1 ảnh' })
  images: any[];

  //Thương hiệu nào
  @IsOptional()
  @IsInt({ message: 'Brand ID phải là một số nguyên!' })
  @Transform(({ value }) => parseInt(value, 10))
  brandID: number;
  // ID của danh mục sản phẩm
  @IsNotEmpty({ message: 'categoryId không được để trống!' })
  @IsInt({ message: 'categoryId phải là một số nguyên!' })
  @Transform(({ value }) => parseInt(value, 10))
  categoryId: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GiftProductDTO)
  giftProducts: GiftProductDTO[] = [];
  // Thời gian tạo (tự động khi tạo, không cần nhập)
  //SKU

  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'SKU không được vượt quá 50 ký tự' })
  @Transform(({ value, obj }) => {
    // Generate SKU if not provided
    if (!value && obj.name) {
      // Generate basic SKU from product name
      const nameParts = obj.name.split(' ').slice(0, 3);
      const prefix = nameParts.map((p) => p.charAt(0).toUpperCase()).join('');
      const timestamp = new Date().getTime().toString().slice(-6);
      return `${prefix}-${timestamp}`;
    }
    return value;
  })
  sku?: string;
}
