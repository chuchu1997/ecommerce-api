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
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

import { OrderFilterDto } from './dto/order-filter.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

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

  // @Roles(Role.ADMIN)
  @Public()
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    console.log('CALL THIS !!');
    const orderUpdate = await this.ordersService.update(id, updateOrderDto);
    return {
      message: '✅✅ Đã cập nhật trạng thái đơn hàng thành công !!  ✅✅',
      orderUpdate,
    };
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}
