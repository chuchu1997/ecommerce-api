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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryFilterDto } from './dto/product-query-filter.dto';

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
    query: ProductQueryFilterDto,
  ) {
    const products = await this.productsService.findProductsWithQuery(query);
    return {
      message: '✅✅ Tìm kiếm sản phẩm thành công ✅✅',
      products,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const productID = new UtilsService().IdStringToNumber(id);

    const product = await this.productsService.findOne(productID);
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
    const productID = new UtilsService().IdStringToNumber(id);

    const product = await this.productsService.update(
      productID,
      updateProductDto,
    );
    return {
      message: '✅✅ Sản phẩm đã được chỉnh sửa ✅✅',
      product,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const productID = new UtilsService().IdStringToNumber(id);
    const product = await this.productsService.remove(productID);
    return {
      message: `✅✅ Sản phẩm với ID:${product.id} đã được xóa  ✅✅`,
      product,
    };
    // return await this.productsService.remove(productId);
  }
}
