import { IsDate, IsOptional } from 'class-validator';

export class DateFilterDto {
  @IsOptional()
  @IsDate()
  dateFrom: Date;
  @IsOptional()
  @IsDate()
  dateTo: Date;
}
