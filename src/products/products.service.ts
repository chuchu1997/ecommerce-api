import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

type SizesForProduct = {
  id: number;
  price: number;
  stock: number;
};

type ColorsForProduct = {
  id: number;
  price: number;
  stock: number;
};
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const {
      name,
      description,
      price,
      isFeatured,
      slug,
      colors,
      sizes,
      stock,
      images,
      categoryId,
    } = createProductDto;

    try {
      if (
        !name ||
        !slug ||
        !description ||
        !price ||
        !stock ||
        !categoryId ||
        !images ||
        images.length === 0
      ) {
        throw new BadRequestException(
          '⚠️⚠️⚠️ Thiếu thông tin bắt buộc để tạo sản phẩm ⚠️⚠️⚠️ ',
        );
      }

      const product = await this.prisma.product.create({
        data: {
          name,
          description: description,
          price: price,
          isFeatured: isFeatured ?? false,
          slug: slug,

          // colors: createProductDto.colors,
          // sizes: createProductDto.sizes,
          stock: createProductDto.stock,
          images: {
            createMany: {
              data: [...images.map((image: { url: string }) => image)],
            },
          },
          categoryId: categoryId,
        },
      });
      if (sizes && sizes.length > 0) {
        await this.createProductWithSizes(product.id, sizes);
      }
      if (colors && colors.length > 0) {
        await this.createProductWithColors(product.id, colors);
      }

      return product;
    } catch (e) {
      throw new BadRequestException('⚠️⚠️⚠️ Lỗi khi tạo sản phẩm ⚠️⚠️⚠️ ');
    }
  }
  async createProductWithSizes(productID: number, sizes: any[]) {
    try {
      await this.prisma.productSize.createMany({
        data: sizes.map((size) => ({
          price: size.price,
          stock: size.stock,
          productId: productID,
          name: size.name, // Example name, replace with actual logic if needed
        })),
      });
    } catch (e) {
      throw new BadRequestException(
        '⚠️⚠️⚠️ Lỗi khi tạo phân loại màu cho sản phẩm ⚠️⚠️⚠️ ',
      );
    }
  }
  async createProductWithColors(productID: number, colors: any[]) {
    try {
      await this.prisma.productColor.createMany({
        data: colors.map((color) => ({
          price: color.price,
          stock: color.stock,
          productId: productID,
          name: color.name, // Example name, replace with actual logic if needed
          hex: color.hex, // Example hex, replace with actual logic if needed
        })),
      });
    } catch (e) {
      throw new BadRequestException(
        '⚠️⚠️⚠️ Lỗi khi tạo phân loại màu cho sản phẩm ⚠️⚠️⚠️ ',
      );
    }
  }
  async findProductsWithQuery(query: {
    page?: number;
    limit?: number;
    isFeatured?: boolean;
    categoryId?: number;
  }) {
    try {
      const { page, limit = 4, isFeatured, categoryId } = query;

      const products = await this.prisma.product.findMany({
        where: {
          categoryId,
          isFeatured: isFeatured ? true : undefined,
        },
        include: {
          images: true,
          category: true,
          colors: true,
          sizes: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: page ? (page - 1) * limit : 0,
      });
      return products;
    } catch (e) {
      throw new BadRequestException('⚠️⚠️⚠️ Lỗi khi tìm kiếm sản phẩm ⚠️⚠️⚠️ ');
    }
  }
  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
