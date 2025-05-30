import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, ProductColor } from '@prisma/client';
import { UploadService } from 'src/upload/upload.service';
import { ProductColorDto } from './dto/product-color/product-color.dto';
import { ProductSizeDto } from './dto/product-size/product-size.dto';
import { ProductQueryFilterDto } from './dto/product-query-filter.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { images, sizes, colors, seo, storeId, ...data } = createProductDto;

    const product = await this.prisma.product.create({
      data: {
        ...data,
        // Nếu có SEO thì tiến hành tạo mới
        // Phải tạo kiểu này vì SEO có relation với PRODUCT !!!
        ...(seo && {
          seo: {
            create: {
              ...seo,
            },
          },
        }),
        storeId: storeId,
        name: data.name,
        description: data.description,
        price: data.price,
        isFeatured: data.isFeatured ?? false,
        sku: data.sku ?? undefined,
        slug: data.slug,
        ...(colors &&
          colors.length > 0 && {
            colors: {
              createMany: {
                data: colors.map((color: ProductColorDto) => ({
                  ...color,
                  price: color.price ?? 0,
                })),
              },
            },
          }),
        ...(sizes &&
          sizes.length > 0 && {
            sizes: {
              createMany: {
                data: sizes.map((size: ProductSizeDto) => ({
                  ...size,
                  price: size.price ?? 0,
                })),
              },
            },
          }),

        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return product;
  }
  async getTotalProducts() {
    return await this.prisma.product.count();
  }
  async getProductBySlug(slug: string) {
    return await this.prisma.product.findUnique({
      where: {
        slug: slug,
      },
    });
  }
  async findProductsWithQuery(query: ProductQueryFilterDto) {
    const { ...data } = query;

    const products = await this.prisma.product.findMany({
      where: {
        slug: data.slug,
        categoryId: data.categoryId,
        isFeatured: data.isFeatured ? true : false,
        storeId: data.storeID,
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
      take: data.limit, // Đảm bảo kiểu số và giá trị mặc định
      skip: (data.currentPage - 1) * data.limit, // Đảm bảo kiểu số và giá trị mặc định
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
      images = [],
      seo,
      colors = [],
      sizes = [],
      ...data
    } = updateProductDto;

    //XÓA ảnh trong s3 nếu như list DB và list image request có thay đổi !!!
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      select: { images: true, seo: true }, // Giả sử "images" là một mảng URL
    });

    // Nếu như object json giống nhau có nghĩa là không có sự thay đổi về hình ảnh nên không cần cập nhật hình ảnh .
    const isImagesUpdated =
      images &&
      JSON.stringify(images) !== JSON.stringify(existingProduct?.images);

    // Kiểm tra nếu danh sách ảnh có thay đổi
    if (isImagesUpdated) {
      const oldUrls = existingProduct?.images?.map((i) => i.url) || [];
      const newUrls = images.map((i) => i.url);
      const urlsToDelete = oldUrls.filter((url) => !newUrls.includes(url));
      await Promise.all(
        urlsToDelete.map((url) => this.uploadService.deleteImagesFromS3(url)),
      );
    }
    const product = await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        ...data,
        ...(seo && {
          //NẾU CÓ DATA SEO THÌ CẬP NHẬT KHÔNG THÌ BỎ QUA !!!
          seo: {
            update: {
              ...seo,
            },
          },
        }),
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
                  notIn: colors.map((c) => c.id).filter(Boolean),
                },
              },
              upsert: colors.map((color: ProductColorDto) => ({
                //Kiểm tra xem có màu sắc nào mới không nếu có thì ghi vào DB
                where: { id: color.id || 0 },
                create: { ...color, price: color.price ?? 0, productId: id },
                update: { ...color, price: color.price ?? 0, productId: id },
              })),
            },
          }),
        ...(sizes &&
          sizes.length > 0 && {
            sizes: {
              deleteMany: {
                id: {
                  notIn: sizes.map((c) => c.id).filter(Boolean),
                },
              },
              // Upsert để cập nhật hoặc tạo mới
              upsert: sizes.map((size: ProductSizeDto) => ({
                where: { id: size.id || 0 },
                create: { ...size, price: size.price ?? 0, productId: id },
                update: { ...size, price: size.price ?? 0, productId: id },
              })),
            },
          }),
      },
    });
    return product;
  }
  convertProductIDStringToNumber(id: string) {
    return parseInt(id, 10);
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
