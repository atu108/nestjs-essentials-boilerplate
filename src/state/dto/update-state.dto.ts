import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateStateDto } from './create-state.dto';

export class UpdateStateDto extends PartialType(CreateStateDto) {
  @IsOptional()
  @IsString()
  status: string;
  @IsString()
  updatedBy: string;
}
