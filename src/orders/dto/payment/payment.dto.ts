import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class PaymentDto {
  @IsNotEmpty({ message: 'Vui lòng chọn phương thức thanh toán !' })
  @IsEnum(PaymentMethod)
  method: string;

  @IsNotEmpty({ message: 'Trạng thái thanh toán không được bỏ trống !' })
  @IsEnum(PaymentStatus)
  status: string;

  @IsNotEmpty({ message: 'Trạng thái thanh toán không được bỏ trống !' })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isPaid: boolean;

  // Tên ngân hàng
  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  transactionId;

  // Người chuyển khoản
  @IsOptional()
  @IsString()
  payerName?: string;
  // Mã giao dịch
}
