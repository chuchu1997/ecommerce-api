import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { FilterCartDto } from './dto/filter-cart.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}
  create(createCartDto: CreateCartDto) {
    return 'This action adds a new cart';
  }

  async findAll(query: FilterCartDto) {
    const { userId, isSelect } = query;

    return await this.prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          where: {
            isSelect: isSelect,
          },
          include: {
            product: {
              include: {
                images: true,
                promotionProducts: {
                  include: {
                    promotion: true,
                  },
                },
                giftProducts: {
                  include: {
                    gift: {
                      include: {
                        images: true,
                      },
                    },
                  },
                },

                colors: true,
                sizes: true,
              },
            },
          },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    const { userId, items } = updateCartDto;

    return await this.prisma.cart.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        items: {
          deleteMany: {},
          createMany: {
            data: (items ?? []).map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              isSelect: item.isSelect,
            })),
          },
        },
      },
      include: {
        items: true,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
