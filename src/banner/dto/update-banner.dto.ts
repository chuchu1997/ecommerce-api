import { PartialType } from '@nestjs/swagger';
import { CreateBannerDTO } from './create-banner.dto';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateBannerDto extends PartialType(CreateBannerDTO) {
  @IsNotEmpty()
  @IsInt({ message: 'ID của Banner phải là kiểu Number ' })
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  id: number;
}
