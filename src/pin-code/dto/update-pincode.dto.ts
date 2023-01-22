import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreatePinCodeDto } from './create-pincode.dto';

export class UpdatePinCodeDto extends PartialType(CreatePinCodeDto) {
  @IsOptional()
  @IsString()
  status: string;
  @IsString()
  updatedBy: string;
}
