import { IsNumber, IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsNumber()
  otp: string;
  @IsString()
  createdBy: string;
}
