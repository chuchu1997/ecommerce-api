import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { MyLogger } from 'src/utils/logger.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, UploadService, MyLogger],
})
export class ProductsModule {}
