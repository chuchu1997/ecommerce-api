import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/upload/upload.service';

@Module({
  controllers: [PromotionController],
  providers: [PromotionService, PrismaService, UploadService],
  exports: [PromotionService],
})
export class PromotionModule {}
