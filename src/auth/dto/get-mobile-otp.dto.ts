import { IsMobilePhone } from 'class-validator';

export class GetMobileOtpDto {
  @IsMobilePhone('en-IN')
  mobile: string;
}
