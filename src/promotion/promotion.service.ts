import { Injectable } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PrismaService } from 'src/prisma.service';
import { PromotionQueryDto } from './dto/promotion-filter.dto';

@Injectable()
export class PromotionService {
  constructor(private prisma: PrismaService) {}
  async create(createPromotionDto: CreatePromotionDto) {
    const { promotionProducts, ...data } = createPromotionDto;

    return await this.prisma.promotion.create({
      data: {
        ...data,
        ...(promotionProducts &&
          promotionProducts.length > 0 && {
            promotionProducts: {
              createMany: {
                data: promotionProducts.map((promotionProduct) => ({
                  productId: promotionProduct.productId,
                  discount: promotionProduct.discount,
                  discountType: promotionProduct.discountType,
                })),
              },
            },
          }),
      },
      include: {
        promotionProducts: true,
      },
    });
  }

  async findAll(query: PromotionQueryDto) {
    const { currentPage, limit, storeID, promotionType, isActive } = query;

    return await this.prisma.promotion.findMany({
      where: {
        promotionType,
        isActive,
        storeId: storeID,
      },
      include: {
        promotionProducts: {
          include: {
            product: {
              include: {
                promotionProducts: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit, // Đảm bảo kiểu số và giá trị mặc định
      skip: (currentPage - 1) * limit, // Đảm bảo kiểu số và giá trị mặc định
    });
  }

  async findOne(id: number) {
    return await this.prisma.promotion.findUnique({
      where: {
        id: id,
      },
      include: {
        promotionProducts: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: number, updatePromotionDto: UpdatePromotionDto) {
    const { promotionProducts, ...data } = updatePromotionDto;
    return await this.prisma.promotion.update({
      where: { id },
      data: {
        ...data,
        // Nếu có promotionProducts mới, xóa hết cũ và tạo lại
        ...(promotionProducts && {
          promotionProducts: {
            deleteMany: {}, // Xóa toàn bộ các product cũ của promotion này
            createMany: {
              data: promotionProducts.map((promotionProduct) => ({
                productId: promotionProduct.productId,
                discount: promotionProduct.discount,
                discountType: promotionProduct.discountType,
              })),
            },
          },
        }),
      },
      include: {
        promotionProducts: true,
      },
    });
  }

  async remove(id: number) {
    await this.prisma.promotion.update({
      where: {
        id,
      },
      data: {
        promotionProducts: {
          deleteMany: {},
        },
      },
    });

    return await this.prisma.promotion.delete({
      where: {
        id,
      },
    });
  }
}
