import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/upload/upload.service';

@Module({
  controllers: [BannerController],
  providers: [BannerService, PrismaService, UploadService],
})
export class BannerModule {}
