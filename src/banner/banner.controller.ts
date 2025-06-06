import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDTO } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Public } from 'src/auth/decorators/public.decorator';

@SkipThrottle()
@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() createBannerDto: CreateBannerDTO) {
    return {
      message: 'Tạo Banner thành công ✅',
      banner: await this.bannerService.create(createBannerDto),
    };
  }
  @Public()
  @Get()
  async findAll() {
    const banners = await this.bannerService.findAll();
    return {
      message: ' Lấy tất cả Banner thành công ✅',
      banners,
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      message: ' Lấy Banner qua ID thành công ✅',
      banner: await this.bannerService.findOne(id),
    };
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBannerDto: UpdateBannerDto,
  ) {
    return {
      message: 'Đã cập nhật Banner thành công !! ✅',
      banner: await this.bannerService.update(id, updateBannerDto),
    };
  }
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return {
      message: '✅✅ Đã xóa Banner Thành công !! ✅✅',
      banner: await this.bannerService.remove(id),
    };
  }
}
