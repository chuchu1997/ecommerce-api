import { PartialType } from '@nestjs/swagger';
import { CreateStoreDto } from './create-store.dto';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {
  @IsNotEmpty()
  @IsInt({ message: 'ID của Store phải là Number !!! ' })
  @Transform(({ value }) => (isNaN(Number(value)) ? undefined : Number(value)))
  id: number;
  @IsNotEmpty({ message: 'Thời gian Cập nhật  Store  không được bỏ trống ' })
  updatedAt?: string | undefined;
}
