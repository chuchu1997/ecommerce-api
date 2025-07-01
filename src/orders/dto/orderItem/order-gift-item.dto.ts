import { IsInt, IsString, IsOptional, Min } from 'class-validator';

export class OrderGiftItemDto {
  @IsString()
  giftName: string;

  @IsString()
  giftImage: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  giftQuantity?: number; // optional vì có default(1) trong Prisma
}
