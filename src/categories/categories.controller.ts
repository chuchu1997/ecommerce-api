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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.create(createCategoryDto);
    return { message: '✅✅ Tạo danh mục thành công ✅✅', category };
  }

  @Get()
  async findAll(@Query() query: { justGetParent?: string }) {
    const categories = await this.categoriesService.findAll(query);
    return {
      message: '✅✅ Lấy danh sách , danh mục thành công  ✅✅',
      categories,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const categoryId = Number(id); // Chuyển từ string sang number
    return await this.categoriesService.findOne(categoryId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const categoryId = Number(id); // Chuyển từ string sang number
    const category = await this.categoriesService.update(
      categoryId,
      updateCategoryDto,
    );
    return { message: '✅✅ Cập nhật danh mục thành công ✅✅', category };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const categoryId = Number(id); // Chuyển từ string sang number
    const category = await this.categoriesService.remove(categoryId);
    return { message: '✅✅ Xóa danh mục thành công ✅✅', category };
  }
}
