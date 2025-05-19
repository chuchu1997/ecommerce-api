import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Không đúng định dạng email !!!' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password phải chứa ít nhất 8 ký tự, bao gồm chữ in hoa, số và ký tự đặc biệt',
  })
  password: string;

  @IsNotEmpty({ message: 'ConfirmPassword không được để trống' })
  @IsString({ message: '' })
  @Match('password', {
    message: 'ConfirmPassword phải trùng khớp với password',
  })
  confirmPassword: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{10}$|^\d{11}$/, {
    message: 'Số điện thoại phải có đúng 10 hoặc 11 chữ số.',
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
