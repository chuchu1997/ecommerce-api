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
  findAll(@Query() query: { justGetParent?: string }) {
    return this.categoriesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('ID', id);
    return this.categoriesService.findOne(+id);
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
