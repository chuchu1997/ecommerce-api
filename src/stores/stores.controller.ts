import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  Query,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { SkipThrottle } from '@nestjs/throttler';
@SkipThrottle()
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Roles(Role.ADMIN)
  @HttpCode(200)
  @Post()
  async create(@Body() createStoreDto: CreateStoreDto) {
    return {
      message: ' Tạo Store Thành Công  ✅',
      store: await this.storesService.create(createStoreDto),
    };

    // return this.storesService.create(createStoreDto);
  }

  @Get()
  findAll() {
    return this.storesService.findAll();
  }
  @Roles(Role.ADMIN)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('userID', ParseIntPipe) userID: number,
  ) {
    return {
      message: ' Tìm thấy Store  ✅',
      store: await this.storesService.findOne(id, userID),
    };
  }

  // LẤY TẤT CẢ STORES THUỘC USER ID !!!!
  @Roles(Role.ADMIN)
  @HttpCode(200)
  @Get('user/:userId')
  async findAllStoreByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return {
      message: 'Tất cả store thuộc về User Này ✅',
      stores: await this.storesService.findAllStoresWithUserID(userId),
    };
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    return this.storesService.update(id, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.storesService.remove(id);
  }
}
