import { PartialType } from '@nestjs/swagger';
import { CreateStoreDto } from './create-store.dto';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {
  @IsNotEmpty({ message: 'Thời gian Cập nhật  Store  không được bỏ trống ' })
  updatedAt?: string | undefined;
}
