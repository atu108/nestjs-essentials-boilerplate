import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetManagerDto {
  @Type(() => Number)
  @IsNumber()
  level: string;
}
