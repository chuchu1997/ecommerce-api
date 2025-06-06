import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleQueryFilterDto } from './dto/query-article.dto';
import { UploadService } from 'src/upload/upload.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}
  async create(createArticleDto: CreateArticleDto) {
    const article = await this.prisma.news.create({
      data: {
        title: createArticleDto.title,
        description: createArticleDto.description,
        slug: createArticleDto.slug,
        storeId: createArticleDto.storeId,
        imageUrl: createArticleDto.imageUrl,
      },
    });
    return article;
  }

  async findAll(query: ArticleQueryFilterDto) {
    const { limit = 4, currentPage = 1, ...data } = query;

    const articles = await this.prisma.news.findMany({
      where: {
        slug: data.slug,
        storeId: data.storeId,
      },
      take: limit,
      skip: (currentPage - 1) * limit,
    });
    return articles;
  }
  async getTotalArticles(storeId: number) {
    return await this.prisma.news.count({
      where: {
        storeId,
      },
    });
  }
  findOne(id: number) {
    return `This action returns a #$ article`;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    const { imageUrl, ...data } = updateArticleDto;

    const existArticle = await this.prisma.news.findUnique({
      where: { id },
      select: {
        imageUrl: true,
      },
    });

    const isImagesUpdated =
      imageUrl &&
      JSON.stringify(imageUrl) !== JSON.stringify(existArticle?.imageUrl);
    if (isImagesUpdated) {
      await this.uploadService.deleteImagesFromS3(existArticle?.imageUrl ?? '');
    }
    const article = await this.prisma.news.update({
      where: {
        id,
        storeId: data.storeId,
      },
      data: {
        ...data,
        imageUrl: imageUrl,
      },
    });

    return article;
  }

  async remove(id: number) {
    const existArticle = await this.prisma.news.findUnique({
      where: { id },
      select: {
        imageUrl: true,
      },
    });
    if (existArticle?.imageUrl) {
      await this.uploadService.deleteImagesFromS3(existArticle.imageUrl);
    }
    return await this.prisma.news.delete({
      where: { id },
    });
  }
}
