import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class SEODto {
  @IsOptional()
  @IsInt({ message: 'ID của SEO phải là Number !!! ' })
  @Transform(({ value }) => parseInt(value, 10))
  id: number;

  @IsNotEmpty({
    message:
      'Không được bỏ trống tiêu đề SEO (Sản phẩm , Danh mục , Bla Bla ) ',
  })
  @MinLength(2, { message: 'Tiêu đề phải trên 2 ký tự ' })
  title: string;

  @IsNotEmpty({
    message:
      'Không được bỏ trống mô tả SEO cho (Sản phẩm , Danh mục , Bla Bla ) ',
  })
  description: string;

  //Chỗ này phân tích list keywords = dấu , hoặc ký tự xuống hàng hoặc gì đó
  @IsNotEmpty()
  keywords: string;

  @IsOptional()
  openGraphTitle: string;
  @IsOptional()
  openGraphDescription: string;
  @IsOptional()
  openGraphImage: string;

  @IsNotEmpty({
    message:
      'Không được bỏ trống url dẫn đến (Sản phẩm , Danh mục , Bla Bla ) !!! ',
  })
  url: string;

  @IsOptional()
  @IsInt({ message: 'ID của SEO của Category phải là Number !!! ' })
  @Transform(({ value }) => parseInt(value, 10))
  categoryId: number;

  @IsOptional()
  @IsInt({ message: 'ID của SEO của Product phải là Number !!! ' })
  @Transform(({ value }) => parseInt(value, 10))
  productId: number;
}
