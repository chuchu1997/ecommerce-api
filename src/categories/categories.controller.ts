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
    const categoryID = new UtilsService().IdStringToNumber(id);

    return await this.categoriesService.findOne(categoryID);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const categoryID = new UtilsService().IdStringToNumber(id);
    const category = await this.categoriesService.update(
      categoryID,
      updateCategoryDto,
    );
    return { message: '✅✅ Cập nhật danh mục thành công ✅✅', category };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const categoryID = new UtilsService().IdStringToNumber(id);
    const category = await this.categoriesService.remove(categoryID);
    return { message: '✅✅ Xóa danh mục thành công ✅✅', category };
  }
}
