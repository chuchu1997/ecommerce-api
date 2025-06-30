import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateUserDTO } from './create-user.dto';
import { Transform } from 'class-transformer';

export class UpdateUserDTO extends CreateUserDTO {
  @IsOptional()
  updatedAt?: string | undefined;
}
