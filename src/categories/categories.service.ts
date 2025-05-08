import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, slug, description, parentId } = createCategoryDto;

    if (!name || !slug || !description) {
      throw new BadRequestException(
        '⚠️⚠️⚠️ Thiếu thông tin bắt buộc để tạo danh mục  ⚠️⚠️⚠️',
      );
    }
    // Kiểm tra xem slug đã tồn tại hay chưa
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug },
    });
    if (existingCategory) {
      throw new BadRequestException('⚠️⚠️⚠️ Slug đã tồn tại ⚠️⚠️⚠️');
    }
    const category = await this.prisma.category.create({
      data: {
        name,
        slug,
        description,
        parentId: parentId ? Number(parentId) : null, // Chuyển đổi parentId thành số nếu có
      },
    });
    console.log('CATE', category);
    return category;
  }

  async findAll(query: { justGetParent?: string }) {
    //Chỉ lấy ra các categories cha !!!
    const { justGetParent = 'false' } = query;
    console.log('JUST', justGetParent);
    const categories = await this.prisma.category.findMany({
      where: {
        parentId: justGetParent === 'true' ? null : undefined, // Lấy các category có parentId là null (các category cha)
      },
      include: {
        subCategories: true, // Lấy cấp con đầu tiên
      },
      orderBy: {
        createdAt: 'desc', // Sắp xếp theo thời gian tạo (có thể tùy chỉnh)
      },
    });
    // Đệ quy lấy các cấp con của từng category
    for (const category of categories) {
      category.subCategories = await this.getNestedCategories(category.id);
    }

    return categories;
  }
  async getNestedCategories(parentId: number | null): Promise<any[]> {
    const categories = await this.prisma.category.findMany({
      where: {
        parentId: parentId, // Lấy các category có parentId bằng tham số truyền vào
      },
      include: {
        subCategories: true, // Lấy cấp con đầu tiên
      },
      orderBy: {
        createdAt: 'desc', // Sắp xếp theo thời gian tạo (có thể tùy chỉnh)
      },
    });

    // Đệ quy lấy các cấp con của từng category
    for (const category of categories) {
      category.subCategories = await this.getNestedCategories(category.id);
    }

    return categories;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { name, slug, description, parentId } = updateCategoryDto;
    if (!name || !slug || !description) {
      throw new BadRequestException(
        '⚠️⚠️⚠️ Thiếu thông tin bắt buộc để cập nhật danh mục  ⚠️⚠️⚠️',
      );
    }
    // Kiểm tra xem slug đã tồn tại hay chưa
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug },
    });
    if (existingCategory && existingCategory.id !== id) {
      throw new BadRequestException('⚠️⚠️⚠️ Slug đã tồn tại ⚠️⚠️⚠️');
    }
    // Cập nhật danh mục
    const category = await this.prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        parentId: parentId ? Number(parentId) : null, // Chuyển đổi parentId thành số nếu có
      },
    });

    return category;

    // await return `This action updates a #${id} category`;
  }

  async remove(id: number) {
    // Xóa danh mục
    const category = await this.prisma.category.delete({
      where: { id },
    });

    return category;
  }
}
