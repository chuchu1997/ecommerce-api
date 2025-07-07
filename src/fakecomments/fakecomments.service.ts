import { Injectable } from '@nestjs/common';
import { CreateFakecommentDto } from './dto/create-fakecomment.dto';
import { UpdateFakecommentDto } from './dto/update-fakecomment.dto';
import { FakeCommentQueryDto } from './dto/fake-filter.dto';
import { ProductsService } from 'src/products/products.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FakecommentsService {
  constructor(
    private productService: ProductsService,
    private prisma: PrismaService,
  ) {}
  async create(createFakecommentDto: CreateFakecommentDto) {
    const { ...data } = createFakecommentDto;

    const comment = await this.prisma.fakeComment.create({
      data,
    });
    return comment;
  }
  async getTotal() {
    return this.prisma.fakeComment.count();
  }
  async findAll(query: FakeCommentQueryDto) {
    const { productID, storeID, limit, currentPage } = query;

    const comments = await this.prisma.fakeComment.findMany({
      where: {
        product: {
          id: productID ? productID : undefined,
          storeId: storeID,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: (currentPage - 1) * limit,
    });
    return comments;
  }

  findOne(id: number) {
    return `This action returns a #${id} fakecomment`;
  }

  async update(id: number, updateFakecommentDto: UpdateFakecommentDto) {
    const { ...data } = updateFakecommentDto;
    await this.prisma.fakeComment.update({
      where: {
        id: id,
        product: {
          id: data.productId,
        },
      },
      data: {
        ...updateFakecommentDto,
      },
    });
    return `This action updates a #${id} fakecomment`;
  }

  remove(id: number) {
    return `This action removes a #${id} fakecomment`;
  }
}
