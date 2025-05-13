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

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  async create(createOrderDto: CreateOrderDTO) {
    const { items, payment, ...orderData } = createOrderDto;
    const order = await this.prisma.order.create({
      data: {
        ...orderData,
        status: OrderStatus.ORDERED,

        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice, // Ensure `unitPrice` is provided in `items`
            product: { connect: { id: item.productId } }, // Ensure `product` is connected
          })),
        },
      },

      include: {
        items: true,
      },
    });
    //CREATE PAYMENT AFTER CREATE ORDER
    if (payment) {
      await this.prisma.payment.create({
        data: {
          method: payment.method as PaymentMethod,
          status: payment.status as PaymentStatus,
          isPaid: payment.isPaid,
          bankName: payment.bankName,
          payerName: payment.payerName,
          transactionId: payment.transactionId,
          orderId: order.id, // Gắn với đơn hàng đã tạo
        },
      });
    }

    return order;
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

  async findAll(query: {
    isToday?: boolean; // Lấy trong 24h qua
    isThisWeek?: boolean; // Lấy trong 7 ngày qua
    isThisMonth?: boolean;
    isCanceled?: boolean; // Đơn hàng bị hủy
    isSent?: boolean; // Đơn hàng đã gửi
    isDelivered?: boolean; // Đơn hàng đã giao
    isCompleted?: boolean; // Đơn hàng đã thành công
  }): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: query.isToday
            ? new Date(Date.now() - 24 * 60 * 60 * 1000)
            : query.isThisWeek
              ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              : query.isThisMonth
                ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                : undefined,
        },
        status: {
          in: [
            query.isCanceled ? 'CANCELED' : undefined,
            query.isSent ? 'SENT' : undefined,
            query.isDelivered ? 'DELIVERED' : undefined,
            query.isCompleted ? 'COMPLETED' : undefined,
          ].filter(Boolean) as OrderStatus[],
        },
      },
    });
    return orders;

    // return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
