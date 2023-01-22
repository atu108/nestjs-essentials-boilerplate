import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateCityDto } from './create-city.dto';

export class UpdateCityDto extends PartialType(CreateCityDto) {
  @IsOptional()
  @IsString()
  status: string;
  @IsString()
  updatedBy: string;
}
