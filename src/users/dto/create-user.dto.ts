import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';
export class CreateUserDTO {
  @IsOptional()
  @IsEmail()
  email: string;
  @IsOptional()
  @IsString()
  @MinLength(8)
  password: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsOptional()
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
