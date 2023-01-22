import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UploadFiledDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
  @IsString()
  createdBy: string;
}
