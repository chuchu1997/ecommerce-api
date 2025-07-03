import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpCode,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleQueryFilterDto } from './dto/query-article.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Roles(Role.ADMIN)
  @HttpCode(200)
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    return {
      message: ' Đã tạo bài viết thành công   ✅',
      article: await this.articlesService.create(createArticleDto),
    };
  }

  @Public()
  @Get()
  async findAll(@Query() query: ArticleQueryFilterDto) {
    // return this.articlesService.findAll(query);
    return {
      message: ' Tìm kiếm nhiều bài viết thành công  ✅',
      articles: await this.articlesService.findAll(query),
      total: await this.articlesService.getTotalArticles(query.storeId),
    };
  }

  @Public()
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return {
      message: 'Tìm thấy bài viết ✅',
      article: await this.articlesService.findOne(slug),
    };
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return {
      message: ' Đã cập nhật bài viết thành công   ✅',
      article: await this.articlesService.update(id, updateArticleDto),
    };
  }
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return {
      message: ' Đã xóa bài viết thành công   ✅',
      article: await this.articlesService.remove(id),
    };
  }
}
