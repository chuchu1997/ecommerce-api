import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  async create(createOrderDto: CreateOrderDto) {
    const { items, payment, ...orderData } = createOrderDto;
    const order = await this.prisma.order.create({
      data: {
        ...orderData,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice, // Ensure `unitPrice` is provided in `items`
            product: { connect: { id: item.productId } }, // Ensure `product` is connected
          })),
        },
        payment: {
          create: payment,
        },
      },
    });
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
        status: status,
      },
    });

    return updatedOrder;
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
