import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { UploadService } from 'src/upload/upload.service';

type SizeType = {
  id: number;
  productId: number;
  price: number;
  name: string;
  stock: number;
};

type ColorType = {
  id: number;
  productId: number;
  hex: string;
  name: string;
  price: number;
  stock: number;
};
@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

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
      sku,
    } = createProductDto;

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
        '⚠️⚠️⚠️ Thiếu thông tin bắt buộc để tạo sản phẩm ⚠️⚠️⚠️',
      );
    }
    const product = await this.prisma.product.create({
      data: {
        name,
        description: description,
        price: price,
        isFeatured: isFeatured ?? false,
        sku: sku ?? undefined,
        slug: slug,
        ...(colors &&
          colors.length > 0 && {
            colors: {
              createMany: {
                data: [...colors.map((color: ColorType) => color)],
              },
            },
          }),
        ...(sizes &&
          sizes.length > 0 && {
            sizes: {
              createMany: {
                data: [...sizes.map((size: SizeType) => size)],
              },
            },
          }),

        stock: createProductDto.stock,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        categoryId: categoryId,
      },
    });

    return product;
  }

  async findProductsWithQuery(query: {
    page?: number;
    limit?: number;
    isFeatured?: boolean;
    categoryId?: number;
    slug?: string;
  }) {
    const { page = 1, limit = 4, isFeatured, categoryId, slug } = query;

    const products = await this.prisma.product.findMany({
      where: {
        slug: slug,
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
      take: Number(limit) || 4, // Đảm bảo kiểu số và giá trị mặc định
      skip: (Number(page) - 1) * (Number(limit) || 4), // Đảm bảo kiểu số và giá trị mặc định
    });

    return products;
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        images: true,
        category: true,
        colors: true,
        sizes: true,
      },
    });
    //TODO:
    if (!product) {
      throw new NotFoundException(
        `⚠️⚠️⚠️ Không tìm thấy sản phẩm với ID:${id} ⚠️⚠️⚠️ `,
      );
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
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
      discount,
      sku,
    } = updateProductDto;

    if (
      (!name ||
        !slug ||
        !description ||
        !price ||
        !stock ||
        !categoryId ||
        !images ||
        images.length === 0,
      sku)
    ) {
      throw new BadRequestException(
        '⚠️⚠️⚠️ Thiếu thông tin bắt buộc để chỉnh sửa sản phẩm ⚠️⚠️⚠️',
      );
    }
    //XÓA ảnh trong s3 nếu như list DB và list image request có thay đổi !!!
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      select: { images: true }, // Giả sử "images" là một mảng URL
    });

    const isImagesUpdated =
      images &&
      JSON.stringify(images) !== JSON.stringify(existingProduct?.images);

    // Kiểm tra nếu danh sách ảnh có thay đổi
    if (isImagesUpdated) {
      // Xóa các ảnh không còn trong danh sách mới
      const imagesToDelete =
        existingProduct?.images?.filter(
          (oldImage) =>
            !images.some((newImage) => newImage.url === oldImage.url),
        ) || [];

      await Promise.all(
        imagesToDelete.map((image) =>
          this.uploadService.deleteImagesFromS3(image.url),
        ),
      );
    }

    const product = await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        sku: sku ?? undefined,
        name,
        description,

        price,
        isFeatured,
        discount,
        ...(isImagesUpdated && {
          images: {
            deleteMany: {}, // Xóa tất cả ảnh cũ trong DB trước khi thêm mới
            createMany: {
              data: images.map((image: { url: string }) => image),
            },
          },
        }),
        ...(colors &&
          colors.length > 0 && {
            colors: {
              deleteMany: {
                id: {
                  //Xóa tất cả các color không có trong mảng colors mới được cập nhật bởi User !!!
                  notIn: colors
                    .map((color: ColorType) => color.id)
                    .filter((id) => !!id),
                },
              },
              upsert: colors.map((color: ColorType) => ({
                //Kiểm tra xem có màu sắc nào mới không nếu có thì ghi vào DB
                where: { id: color.id || 0 },
                create: {
                  price: color.price,
                  stock: color.stock,
                  name: color.name,
                  hex: color.hex,
                  productId: id,
                },
                update: {
                  price: color.price,
                  stock: color.stock,
                  name: color.name,
                  hex: color.hex,
                  productId: id,
                },
              })),
            },
          }),
        ...(sizes &&
          sizes.length > 0 && {
            sizes: {
              deleteMany: {
                id: {
                  notIn: sizes
                    .map((size: SizeType) => size.id)
                    .filter((id) => !!id),
                },
              },
              // Upsert để cập nhật hoặc tạo mới
              upsert: sizes.map((size: SizeType) => ({
                where: { id: size.id || 0 },
                create: {
                  name: size.name,
                  price: size.price,
                  productId: id,
                  stock: size.stock,
                },
                update: {
                  name: size.name,
                  price: size.price,
                  stock: size.stock,
                  productId: id,
                },
              })),
            },
          }),
      },
    });
    return product;
  }

  async remove(id: number) {
    //Phải xóa các bản ghi images liên quan ở S3 clound trước khi xóa !!!
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      select: { images: true },
    });

    if (!existingProduct) {
      throw new NotFoundException(
        `⚠️⚠️⚠️ Sản phẩm với ID ${id} không tồn tại để xóa  ⚠️⚠️⚠️ `,
      );
    }
    //Phải xóa các bản ghi images liên quan ở S3 clound trước khi xóa !!!

    if (existingProduct?.images) {
      await Promise.all(
        existingProduct.images.map((image) =>
          this.uploadService.deleteImagesFromS3(image.url),
        ),
      );
    }

    await this.prisma.product.update({
      where: { id },
      data: {
        images: {
          deleteMany: {},
          // Xóa tất cả ảnh liên quan đến sản phẩm ở bảng images quan hệ đến productId
        },
        sizes: {
          // Xóa tất cả sizes liên quan đến sản phẩm ở bảng ProductSize quan hệ đến productId
          deleteMany: {},
        },
        colors: {
          //xóa tất cả colors liên quan đến sản phẩm ở bảng ProductColor quan hệ đến productId
          deleteMany: {},
        },
      },
    });
    const product = await this.prisma.product.delete({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(
        `⚠️⚠️⚠️ Không tìm thấy sản phẩm để xóa với ID:${id} ⚠️⚠️⚠️ `,
      );
    }
    return product;
  }
}
