import { IsPostalCode, IsString } from 'class-validator';

export class CreatePinCodeDto {
  @IsPostalCode('IN')
  pin: string;
  @IsString()
  area: string;
  @IsString()
  cityId: string;
  @IsString()
  createdBy: string;
}
