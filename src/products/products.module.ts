import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/upload/upload.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, UploadService],
})
export class ProductsModule {}
