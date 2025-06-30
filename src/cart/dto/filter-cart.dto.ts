import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class FilterCartDto {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  userId: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isSelect: boolean;
}
