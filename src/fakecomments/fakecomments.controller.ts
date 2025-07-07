import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { FakecommentsService } from './fakecomments.service';
import { CreateFakecommentDto } from './dto/create-fakecomment.dto';
import { UpdateFakecommentDto } from './dto/update-fakecomment.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from 'src/auth/decorators/public.decorator';
import { FakeCommentQueryDto } from './dto/fake-filter.dto';

@SkipThrottle()
@Controller('fakecomments')
export class FakecommentsController {
  constructor(private readonly fakecommentsService: FakecommentsService) {}

  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() createFakecommentDto: CreateFakecommentDto) {
    return {
      message: 'Đã tạo thành công comment mới',
      comment: await this.fakecommentsService.create(createFakecommentDto),
    };
  }

  @Public()
  @Get()
  async findAll(@Query() filterDto: FakeCommentQueryDto) {
    return {
      message: 'Lấy tất cả bình luận giả thành công 👍',
      comments: await this.fakecommentsService.findAll(filterDto),
      total: await this.fakecommentsService.getTotal(),
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fakecommentsService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFakecommentDto: UpdateFakecommentDto,
  ) {
    return {
      message: 'Đã cập nhập comment thành công 👍',
      comment: await this.fakecommentsService.update(id, updateFakecommentDto),
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fakecommentsService.remove(+id);
  }
}
