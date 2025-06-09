import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/upload/upload.service';

@Module({
  controllers: [StoresController],
  providers: [StoresService, UsersService, PrismaService, UploadService],
})
export class StoresModule {}
