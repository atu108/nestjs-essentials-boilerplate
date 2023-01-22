import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class MarkAttendanceDto {
  @IsBoolean()
  isPresent: boolean;
  @IsString()
  @IsOptional()
  absenceReason: string;
}
