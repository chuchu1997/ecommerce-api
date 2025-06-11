import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma.service';
import { CategoryQueryFilterDto } from './dto/category-query-filter.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { seo, ...data } = createCategoryDto;

    // Kiểm tra xem slug đã tồn tại hay chưa
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: data.slug },
    });
    if (existingCategory) {
      throw new BadRequestException(
        '⚠️⚠️⚠️ Slug Category này đã tồn tại ⚠️⚠️⚠️',
      );
    }
    const category = await this.prisma.category.create({
      data: {
        ...data,
        ...(seo && {
          seo: {
            create: {
              ...seo,
            },
          },
        }),
      },
    });

    return category;
  }

  async findAll(query: CategoryQueryFilterDto) {
    //Chỉ lấy ra các categories cha !!!
    const { justGetParent = false, storeID } = query;
    console.log('QUERY', query);
    const categories = await this.prisma.category.findMany({
      where: {
        storeId: storeID,
        parentId: justGetParent ? null : undefined,
        // parentId: justGetParent === 'true' ? null : undefined, // Lấy các category có parentId là null (các category cha)
      },
      include: {
        subCategories: true, // Lấy cấp con đầu tiên
      },
      // orderBy: {
      //   createdAt: 'desc', // Sắp xếp theo thời gian tạo (có thể tùy chỉnh)
      // },
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

  async findOne(slug: string, query: CategoryQueryFilterDto) {
    const { storeID } = query;
    console.log('FIND ONE CALL !');
    const category = await this.prisma.category.findUnique({
      where: {
        slug,
        storeId: storeID,
      },
      include: {
        products: {
          include: {
            images: true,
            sizes: true,
            colors: true,
          },
        },
      },
    });
    return category;
  }
  convertCategoryIdToNumber(categoryID: string): number {
    return parseInt(categoryID, 10);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { seo, ...data } = updateCategoryDto;
    // Kiểm tra xem slug đã tồn tại hay chưa
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: data.slug },
    });
    if (existingCategory && existingCategory.id !== id) {
      throw new BadRequestException('⚠️⚠️⚠️ Slug đã tồn tại ⚠️⚠️⚠️');
    }
    // Cập nhật danh mục
    const category = await this.prisma.category.update({
      where: { id, storeId: data.storeId },
      data: {
        ...data,
        parentId: data.parentId ?? null,
        ...(seo && {
          //NẾU CÓ DATA SEO THÌ CẬP NHẬT KHÔNG THÌ BỎ QUA !!!
          seo: {
            update: {
              ...seo,
            },
          },
        }),
      },
    });
    console.log('OBJECT UPDATE', category);

    return category;

    // await return `This action updates a #${id} category`;
  }

  async remove(id: number, storeID: number) {
    // Xóa danh mục
    const category = await this.prisma.category.delete({
      where: {
        id,
        storeId: storeID,
      },
    });

    return category;
  }
}
