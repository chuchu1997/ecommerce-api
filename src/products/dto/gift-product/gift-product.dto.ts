import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GiftProductDTO {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsString()
  note?: string;
}
