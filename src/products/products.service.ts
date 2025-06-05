import {
  BadRequestException,
  Injectable,
  Logger,
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
import { MyLogger } from 'src/utils/logger.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,

    private logger: MyLogger,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { images, sizes, colors, seo, storeId, ...data } = createProductDto;
    try {
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
                    price: color.price ?? data.price,
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
                    price: size.price ?? data.price,
                  })),
                },
              },
            }),

          images: {
            createMany: {
              data: images,
            },
          },
        },
      });
      this.logger.debug(`Đã tạo product ${product.name}`);
      return product;
    } catch (err) {
      this.logger.error(`Lỗi Tạo Product , Message ${err}`);
    }
  }
  async getTotalProducts(storeId: number) {
    return await this.prisma.product.count({
      where: {
        storeId: storeId,
      },
    });
  }
  async getProductBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        slug: slug,
      },
      include: {
        images: true,
        // category: true,
        colors: true,
        sizes: true,
      },
    });

    return product;
  }
  async findProductsWithQuery(query: ProductQueryFilterDto) {
    const { limit = 4, currentPage = 1, ...data } = query;

    const products = await this.prisma.product.findMany({
      where: {
        slug: data.slug,
        categoryId: data.categoryId,
        isFeatured: data.isFeatured ? true : undefined,
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
      take: limit, // Đảm bảo kiểu số và giá trị mặc định
      skip: (currentPage - 1) * limit, // Đảm bảo kiểu số và giá trị mặc định
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

    try {
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
          colors: {
            deleteMany:
              colors && colors.length > 0
                ? {
                    id: {
                      notIn: colors
                        .map((c) => c.id)
                        .filter(
                          (id): id is number =>
                            typeof id === 'number' && id > 0,
                        ),
                    },
                  }
                : {}, // nếu không có colors, xóa hết tất cả colors liên quan

            upsert:
              colors && colors.length > 0
                ? colors.map((color: ProductColorDto) => {
                    const dataColors = {
                      ...color,
                      price:
                        color.price !== undefined &&
                        color.price !== null &&
                        color.price !== 0
                          ? color.price
                          : (data.price ?? product.price),
                    };
                    return {
                      where: { id: color.id ?? 0 }, // id = 0 cho tạo mới (nên check id === undefined)
                      create: dataColors,
                      update: dataColors,
                    };
                  })
                : [],
          },
          sizes: {
            deleteMany:
              sizes && sizes.length > 0
                ? {
                    id: {
                      notIn: sizes
                        .map((c) => c.id)
                        .filter(
                          (id): id is number =>
                            typeof id === 'number' && id > 0,
                        ),
                    },
                  }
                : {}, // nếu không có colors, xóa hết tất cả colors liên quan

            upsert:
              sizes && sizes.length > 0
                ? sizes.map((size: ProductSizeDto) => {
                    const dataSize = {
                      name: size.name,
                      price: size.price ?? product.price,
                      stock: size.stock ?? 0,
                    };
                    return {
                      where: { id: size.id ?? 0 }, // dùng id nếu có, hoặc 0 (hoặc bạn có logic riêng)
                      create: dataSize,
                      update: dataSize,
                    };
                  })
                : [],
          },
        },
      });
      return product;
    } catch (err) {
      console.log('ERR', err);
    }
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
