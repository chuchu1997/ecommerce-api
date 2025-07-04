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

    let user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // 2. Nếu không có user → tạo mới
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          cart: {
            create: {
              items: {
                create: [],
              },
            },
          },
        },
      });
    }

    return await this.prisma.cart.findUnique({
      where: {
        userId: user.id,
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
    let user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          id: userId, // hoặc để Prisma tự sinh ID mới nếu dùng UUID hay auto increment
          // Các trường cần thiết khác như email, name, etc.
          cart: {
            create: {
              items: {
                create: items?.map((item) => ({
                  productId: item.productId,
                  isSelect: true,
                  quantity: item.quantity,
                })),
              },
            },
          },
        },
      });
    }

    return await this.prisma.cart.update({
      where: {
        id: id,
        userId: user.id,
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
