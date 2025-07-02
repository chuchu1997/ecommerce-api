import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

import { OrderFilterDto } from './dto/order-filter.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from 'src/auth/decorators/public.decorator';

@SkipThrottle()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @HttpCode(200)
  @Public()
  @Post()
  async create(@Body() createOrderDto: CreateOrderDTO) {
    return {
      message: 'Đã tạo order thành công !! ✅',
      order: await this.ordersService.create(createOrderDto),
    };
  }

  @Public()
  @Get()
  async findAll(
    @Query()
    queryFilter: OrderFilterDto,
  ) {
    const orders = await this.ordersService.findAll(queryFilter);
    return {
      message: '✅✅ Lấy danh sách đơn hàng thành công ✅✅',
      orders: orders ?? [],
      total: await this.ordersService.getTotalOrder(),
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const orderID = new UtilsService().IdStringToNumber(id);
    return this.ordersService.findOne(orderID);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    // return this.ordersService.update(+id, updateOrderDto);
    const orderID = new UtilsService().IdStringToNumber(id);

    const orderUpdate = await this.ordersService.update(
      orderID,
      updateOrderDto,
    );
    return {
      message: '✅✅ Đã cập nhật trạng thái đơn hàng thành công !!  ✅✅',
      orderUpdate,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const orderID = new UtilsService().IdStringToNumber(id);
    return this.ordersService.remove(orderID);
  }
}
