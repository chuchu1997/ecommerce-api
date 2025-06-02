import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryFilterDto } from './dto/product-query-filter.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('products')
@SkipThrottle()
// @UseFilters(AllExceptionsFilter)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //CHI ADMIN CO QUYEN TAO MOI SAN PHAM
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return {
      message: 'Sản phẩm đã được tạo thành công ✅',
      product,
    };
  }

  // @Roles(Role.CUSTOMER)
  @Get()
  async findAll(
    @Query()
    query: ProductQueryFilterDto,
  ) {
    return {
      message: ' Tìm kiếm sản phẩm thành công ✅',
      products: await this.productsService.findProductsWithQuery(query),
      total: await this.productsService.getTotalProducts(),
    };
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return {
      message: 'Tìm kiếm sản phẩm thành công ✅',
      product: await this.productsService.getProductBySlug(slug),
    };
    // const productID = new UtilsService().IdStringToNumber(id);

    // const product = await this.productsService.findOne(productID);
    // return {
    //   message: '✅✅ Sản phẩm tìm được thông qua ID ✅✅',
    //   product,
    // };
  }
  //CHI ADMIN CO QUYEN CHINH SUA
  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    // const productID = new UtilsService().IdStringToNumber(id);

    const product = await this.productsService.update(id, updateProductDto);
    return {
      message: ' Sản phẩm đã được chỉnh sửa ✅',
      product,
    };
  }
  //CHI ADMIN CO QUYEN DELETE
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productsService.remove(id);
    return {
      message: ` Sản phẩm với ID:${product.id} đã được xóa ✅`,
      product,
    };
    // return await this.productsService.remove(productId);
  }
}
