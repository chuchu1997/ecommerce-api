import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
  create(@Body() createFakecommentDto: CreateFakecommentDto) {
    return this.fakecommentsService.create(createFakecommentDto);
  }

  @Public()
  @Get()
  findAll(@Query() filterDto: FakeCommentQueryDto) {
    return this.fakecommentsService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fakecommentsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFakecommentDto: UpdateFakecommentDto,
  ) {
    return this.fakecommentsService.update(+id, updateFakecommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fakecommentsService.remove(+id);
  }
}
