import { IsIn, IsString } from 'class-validator';
import { EXCEL_TYPES_LIST } from '../../common/constants/app.constant';

export class ExcelGenerateDto {
  @IsString()
  @IsIn(EXCEL_TYPES_LIST)
  type: string;
  @IsString()
  createdBy: string;
}
