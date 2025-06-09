import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { StoreSocialDto } from './socials/store-social.dto';

export class CreateStoreDto {
  // Tên sản phẩm
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Tên sản phẩm phải có ít nhất 3 ký tự' })
  @MaxLength(200, { message: 'Tên sản phẩm không được vượt quá 200 ký tự' })
  name: string;
  // Mô tả sản phẩm

  // Giá sản phẩm
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  userID: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  email?: string;

  // Số điện thoại
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  logo?: string; //URL

  @IsString()
  @IsOptional()
  favicon?: string; //URL

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StoreSocialDto)
  @IsOptional()
  socials?: StoreSocialDto[] = [];
}
