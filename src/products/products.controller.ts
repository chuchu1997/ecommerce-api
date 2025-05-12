import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseFilters,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AllExceptionsFilter } from 'src/filters/all-exceptions/all-exceptions.filter';

@Controller('products')
// @UseFilters(AllExceptionsFilter)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return {
      message: '✅✅ Sản phẩm đã được tạo thành công ✅✅',
      product,
    };
  }

  @Get()
  async findAll(
    @Query()
    query: {
      page?: number;
      limit?: number;
      isFeatured?: boolean;
      categoryId?: number;
      slug: string;
    },
  ) {
    const products = await this.productsService.findProductsWithQuery(query);
    return {
      message: '✅✅ Tìm kiếm sản phẩm thành công ✅✅',
      products,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const productId = parseInt(id, 10); // Chuyển từ string sang number
    if (isNaN(productId)) {
      throw new BadRequestException('ID phải là một số hợp lệ');
    }
    const product = await this.productsService.findOne(productId);
    return {
      message: '✅✅ Sản phẩm tìm được thông qua ID ✅✅',
      product,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const productId = Number(id); // Chuyển từ string sang number
    if (isNaN(productId)) {
      throw new BadRequestException('⚠️⚠️ ID phải là một số hợp lệ ⚠️⚠️');
    }
    const product = await this.productsService.update(
      productId,
      updateProductDto,
    );
    return {
      message: '✅✅ Sản phẩm đã được chỉnh sửa ✅✅',
      product,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const productId = Number(id); // Chuyển từ string sang number
    if (isNaN(productId)) {
      throw new BadRequestException('⚠️⚠️ ID phải là một số hợp lệ ⚠️⚠️');
    }
    const product = await this.productsService.remove(productId);
    return {
      message: `✅✅ Sản phẩm với ID:${product.id} đã được xóa  ✅✅`,
      product,
    };
    // return await this.productsService.remove(productId);
  }
}
