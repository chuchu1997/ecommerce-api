import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/upload/upload.service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, PrismaService, UploadService],
})
export class ArticlesModule {}
