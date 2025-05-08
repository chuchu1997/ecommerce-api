import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService], // Xuất UploadService để sử dụng ở nơi khác nếu cần
})
export class UploadModule {}
