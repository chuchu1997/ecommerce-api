export class CreateProductDto {
  // Tên sản phẩm
  name: string;
  // Mô tả sản phẩm

  description: string;
  // Giá sản phẩm
  price: number;

  // Trạng thái nổi bật (featured) của sản phẩm

  isFeatured: boolean = false;

  // Slug cho sản phẩm

  slug: string;

  // Giảm giá

  discount: number = 0;

  // Số lượt xem

  viewCount: number = 0;

  // Số lượt đánh giá

  ratingCount: number = 0;

  // Màu sắc của sản phẩm

  colors: string[];

  // Kích thước của sản phẩm

  sizes: string[];

  // Số lượng trong kho

  stock: number;

  // Ảnh của sản phẩm (URL hoặc base64)

  images: any[];

  // ID của danh mục sản phẩm

  categoryId: number;

  // Thời gian tạo (tự động khi tạo, không cần nhập)

  createdAt?: string;

  // Thời gian cập nhật (tự động cập nhật)

  updatedAt?: string;
}
