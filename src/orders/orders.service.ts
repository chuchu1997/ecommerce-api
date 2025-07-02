import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDTO } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma.service';
import {
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '@prisma/client';
import { OrderFilterDto } from './dto/order-filter.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  async create(createOrderDto: CreateOrderDTO) {
    const { items, payment, ...orderData } = createOrderDto;

    try {
      const order = await this.prisma.order.create({
        data: {
          ...orderData,
          status: OrderStatus.ORDERED,
          items: {
            create: items.map((item) => ({
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.subtotal,
              promotionName: item.promotionName ?? '',
              discountType: item.discountType ?? null,
              discountValue: item.discountValue ?? null,
              giftItems: item.giftItems?.length
                ? {
                    create: item.giftItems.map((gift) => ({
                      giftName: gift.giftName,
                      giftImage: gift.giftImage,
                      giftQuantity: gift.giftQuantity,
                    })),
                  }
                : undefined,
              product: { connect: { id: item.productId } }, // Ensure `product` is connected
            })),
          },
          payment: {
            create: {
              method: payment.method as PaymentMethod,
              status: payment.status as PaymentStatus,
              isPaid: payment.isPaid,
              bankName: payment.bankName,
              payerName: payment.payerName,
              transactionId: payment.transactionId,
            },
          },
        },

        include: {
          items: true,
        },
      });
      //CREATE PAYMENT AFTER CREATE ORDER
      // CẬP NHẬT LẠI STOCK CỦA SẢN PHẨM
      for (const item of items) {
        await this.prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity, // Trừ đi số lượng đã đặt
            },
          },
        });
      }

      // CẬP NHẬT LẠI GIỎ HÀNG CỦA NGƯỜI DÙNG KHI ĐÃ ĐẶT HÀNG THÀNH CÔNG

      await this.prisma.cartItem.deleteMany({
        where: {
          productId: {
            in: items.map((item) => item.productId),
          },
        },
      });

      return order;
    } catch (err) {
      console.log('ERROR ', err);
    }
  }
  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const { items = [], payment, status, ...orderData } = updateOrderDto;
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!existingOrder) {
      throw new BadRequestException(
        `⚠️⚠️⚠️ Không tìm thấy đơn hàng để cập nhật trạng thái với ID ${id} ⚠️⚠️⚠️`,
      );
    }
    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        ...orderData,
      },
    });

    return updatedOrder;
  }

  async getTotalOrder() {
    return await this.prisma.order.count();
  }

  async findAll(query: OrderFilterDto) {
    try {
      const orders = await this.prisma.order.findMany({
        where: {
          userId: query.userId ?? undefined,
          createdAt: {
            gte: query.isToday
              ? new Date(Date.now() - 24 * 60 * 60 * 1000)
              : query.isThisWeek
                ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                : query.isThisMonth
                  ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  : undefined,
          },

          // status: {
          //   in: [
          //     query.isCanceled ? 'CANCELED' : undefined,
          //     query.isSent ? 'SENT' : undefined,
          //     query.isDelivered ? 'DELIVERED' : undefined,
          //     query.isCompleted ? 'COMPLETED' : undefined,
          //   ].filter(Boolean) as OrderStatus[],
          // },
        },
        take: query.limit ?? undefined,
        skip: (query.currentPage - 1) * query.limit,
        include: {
          user: {
            select: {
              name: true,
              address: true,
              phone: true,
            },
          },
          payment: true,
          items: {
            include: {
              giftItems: true,
              product: {
                include: {
                  promotionProducts: {
                    select: {
                      promotion: true,
                    },
                  },
                  images: true,
                },
              },
            },
          },
        },
      });

      return orders;
    } catch (err) {
      console.log('ERR', err);
    }

    // return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  remove(id: number) {
    //     DELETE FROM "OrderGiftItem";
    // DELETE FROM "OrderItem";
    // DELETE FROM "Order";
    return `This action removes a #${id} order`;
  }
}
