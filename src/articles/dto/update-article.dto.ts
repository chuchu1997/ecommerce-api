import { PartialType } from '@nestjs/swagger';
import { CreateArticleDto } from './create-article.dto';
import { IsOptional } from 'class-validator';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @IsOptional()
  updatedAt?: string | undefined;
}
