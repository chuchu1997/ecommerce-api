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
    const { seo, ...data } = createArticleDto;

    const article = await this.prisma.news.create({
      data: {
        ...(seo !== undefined && {
          seo: seo as any, // Cast to 'any' or 'Prisma.InputJsonValue'
        }),
        ...data,
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
  async findOne(slug: string) {
    return await this.prisma.news.findUnique({
      where: {
        slug: slug,
      },
    });
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    const { imageUrl, seo, ...data } = updateArticleDto;

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
        ...(seo !== undefined && {
          seo: seo as any, // Cast to 'any' or 'Prisma.InputJsonValue'
        }),
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
