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

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const product = await this.productsService.create(createProductDto);
      return {
        message: '✅✅ Sản phẩm đã được tạo thành công ✅✅',
        product,
      };
    } catch (e) {
      return {
        message: '📛📛📛 Có lỗi xảy ra khi tạo sản phẩm 📛📛📛',
        error: e.response || e.message,
      };
    }
    // return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Query()
    query: {
      page?: number;
      limit?: number;
      isFeatured?: boolean;
      categoryId?: number;
    },
  ) {
    try {
      const products = await this.productsService.findProductsWithQuery(query);
      return { message: '✅✅ Các sản phẩm tìm được ✅✅ ', products };
    } catch (e) {
      return {
        message: '📛📛📛 Có lỗi xảy ra khi lấy danh sách sản phẩm 📛📛📛',
        error: e.response || e.message,
      };
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
