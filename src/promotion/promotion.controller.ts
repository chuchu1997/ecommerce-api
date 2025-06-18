import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('promotion')
@SkipThrottle()
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Roles(Role.ADMIN)
  @HttpCode(200)
  @Post()
  async create(@Body() createPromotionDto: CreatePromotionDto) {
    return {
      message: 'Chương trình khuyến mãi đã tạo thành công ✅',
      promotion: await this.promotionService.create(createPromotionDto),
    };
  }

  @Public()
  @Get()
  findAll() {
    return this.promotionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.promotionService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ) {
    return this.promotionService.update(+id, updatePromotionDto);
  }
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionService.remove(+id);
  }
}
