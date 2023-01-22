import { IsIn, IsOptional } from 'class-validator';
import { SORT_ORDER, SORT_ORDER_LIST } from '../constants/app.constant';
import { STATUS } from '../constants/user.constant';

export class PaginationQueryDto {
  @IsOptional()
  limit: number = +process.env.PAGE_SIZE;
  @IsOptional()
  page = 1;
  @IsOptional()
  sortBy: string;
  @IsOptional()
  @IsIn(SORT_ORDER_LIST)
  sortOrder: string = SORT_ORDER['ASC'];
  @IsOptional()
  isDropdown = false;
  @IsOptional()
  status: string = STATUS['ACTIVE'];
}
