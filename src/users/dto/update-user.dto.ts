import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateUserDTO } from './create-user.dto';
import { Transform } from 'class-transformer';

export class UpdateUserDTO extends CreateUserDTO {
  @IsNotEmpty()
  @IsInt({ message: 'ID của User phải là Number !!! ' })
  @Transform(({ value }) => (isNaN(Number(value)) ? undefined : Number(value)))
  id: number;

  @IsNotEmpty({ message: 'Thời gian Cập nhật  Product không được bỏ trống ' })
  updatedAt?: string | undefined;
}
