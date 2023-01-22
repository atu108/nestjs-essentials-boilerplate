import { IsIn, IsOptional, IsString } from 'class-validator';
import { OTP_PURPOSE_LIST } from '../../common/constants/app.constant';

export class CreateOtpDto {
  @IsOptional()
  @IsString()
  userId?: string;
  @IsOptional()
  @IsString()
  mobile?: string;
  @IsString()
  code: string | number;
  @IsString()
  @IsIn(OTP_PURPOSE_LIST)
  purpose: string;
}
