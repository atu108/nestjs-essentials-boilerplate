import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { EXCEL_TYPES_LIST } from '../../common/constants/app.constant';

export class BulkUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
  @IsString()
  @IsIn(EXCEL_TYPES_LIST)
  type: string;
  @IsString()
  createdBy: string;
}
