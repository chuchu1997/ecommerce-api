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
        ...(seo !== undefined && {
          seo: seo as any, // Cast to 'any' or 'Prisma.InputJsonValue'
        }),
      },
    });

    return category;
  }

  async findAll(query: CategoryQueryFilterDto) {
    //Chỉ lấy ra các categories cha !!!
    const { justGetParent = false, storeID } = query;

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
    const { storeID, currentPage = 1, limit = 4 } = query;
    // First get the main category

    const mainCategory = await this.prisma.category.findUnique({
      where: {
        slug,
        storeId: storeID,
      },
    });

    if (!mainCategory) return null;

    // Recursive function to get all descendant category IDs
    const getAllDescendantCategoryIds = async (categoryId) => {
      const categoryIds = [categoryId];

      // Get direct subcategories
      const subCategories = await this.prisma.category.findMany({
        where: {
          parentId: categoryId,
          storeId: storeID,
        },
        select: { id: true },
      });

      // Recursively get subcategories of each subcategory
      for (const subCategory of subCategories) {
        const descendantIds = await getAllDescendantCategoryIds(subCategory.id);
        categoryIds.push(...descendantIds);
      }

      return categoryIds;
    };

    // Get all category IDs (main + all descendants)
    const allCategoryIds = await getAllDescendantCategoryIds(mainCategory.id);

    // Get all products from all these categories
    const allProducts = await this.prisma.product.findMany({
      where: {
        categoryId: {
          in: allCategoryIds,
        },
      },
      include: {
        promotionProducts: {
          include: {
            promotion: true,
          },
        },
        giftProducts: {
          include: {
            gift: {
              include: {
                images: true,
              },
            },
          },
        },
        images: true,
        sizes: true,
        colors: true,
      },
      skip: (currentPage - 1) * limit,
      take: limit,
    });

    return {
      ...mainCategory,
      products: allProducts,
      totalProducts: allProducts.length,
    };
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
        ...(seo !== undefined && {
          seo: seo as any, // Cast to 'any' or 'Prisma.InputJsonValue'
        }),
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
