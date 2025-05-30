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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQueryFilterDto } from './dto/category-query-filter.dto';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @HttpCode(200)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    // const category = await this.categoriesService.create(createCategoryDto);
    return {
      message: ' Tạo danh mục thành công ✅',
      category: await this.categoriesService.create(createCategoryDto),
    };
  }

  @Get()
  async findAll(@Query() query: CategoryQueryFilterDto) {
    return {
      message: ' Lấy danh sách , danh mục thành công  ✅',
      categories: await this.categoriesService.findAll(query),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const categoryID = new UtilsService().IdStringToNumber(id);

    return await this.categoriesService.findOne(categoryID);
  }
  @HttpCode(200)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.update(id, updateCategoryDto);
    return { message: ' Cập nhật danh mục thành công ✅', category };
  }
  @HttpCode(200)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('storeID', ParseIntPipe) storeID: number,
  ) {
    return {
      message: ' Xóa danh mục thành công ✅',
      category: await this.categoriesService.remove(id, storeID),
    };
  }
}
