import { SocialType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class StoreSocialDto {
  // SocialType
  @IsOptional()
  @IsInt({ message: 'ID của Product phải là Number !!! ' })
  @Transform(({ value }) => (isNaN(Number(value)) ? undefined : Number(value)))
  id: number;
  @IsNotEmpty({ message: 'Tên không được để trống!' })
  type: SocialType;
  @IsNotEmpty({ message: 'Url không được để trống' })
  url: string;
}
