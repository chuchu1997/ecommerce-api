import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Or } from '@prisma/client/runtime/library';
import { OrderFilterDto } from './dto/order-filter.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  async findAll(
    @Query()
    queryFilter: OrderFilterDto,
  ) {
    const orders = await this.ordersService.findAll(queryFilter);
    return {
      message: '✅✅ Lấy danh sách đơn hàng thành công ✅✅',
      orders,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    // return this.ordersService.update(+id, updateOrderDto);
    const orderId = Number(id); // Chuyển từ string sang number
    const orderUpdate = await this.ordersService.update(
      orderId,
      updateOrderDto,
    );
    return {
      message: '✅✅ Đã cập nhật trạng thái đơn hàng thành công !!  ✅✅',
      orderUpdate,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
