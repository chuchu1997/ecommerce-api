import { IsInt, IsString, IsOptional, Min, Max } from 'class-validator';

export class CreateFakecommentDto {
  @IsInt()
  productId: number;
  @IsString()
  content: string;
  @IsString()
  authorName: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  ratingCount: number;
}
