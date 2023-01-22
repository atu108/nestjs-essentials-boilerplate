import { IsMobilePhone, IsNumber } from 'class-validator';

export class LoginMobileOtpDto {
  @IsMobilePhone('en-IN')
  mobile: string;
  @IsNumber()
  otp: number;
}
