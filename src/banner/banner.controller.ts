import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDTO } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  async create(@Body() createBannerDto: CreateBannerDTO) {
    const banner = await this.bannerService.create(createBannerDto);
    return {
      message: '✅✅ Tạo Banner thành công ✅✅',
      banner,
    };
  }

  @Get()
  async findAll() {
    const banners = await this.bannerService.findAll();
    return {
      message: '✅✅ Lấy tất cả Banner thành công ✅✅',
      banners,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const bannerID = new UtilsService().IdStringToNumber(id);
    const banner = await this.bannerService.findOne(bannerID);
    return {
      message: '✅✅ Lấy Banner qua ID thành công ✅✅',
      banner,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
  ) {
    const bannerID = new UtilsService().IdStringToNumber(id);

    const banner = await this.bannerService.update(bannerID, updateBannerDto);
    return {
      message: '✅✅ Đã cập nhật Banner thành công !! ✅✅',
      banner,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const bannerID = new UtilsService().IdStringToNumber(id);
    const banner = await this.bannerService.remove(bannerID);
    return {
      message: '✅✅ Đã xóa Banner Thành công !! ✅✅',
      banner,
    };
  }
}
