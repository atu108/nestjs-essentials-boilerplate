import { IsIn, IsString } from 'class-validator';
import { ACCESS_TYPE_LIST } from 'src/common/constants/user.constant';
export class CreateRoleDto {
  @IsIn(ACCESS_TYPE_LIST)
  name: string;
  @IsString()
  description: string;
  @IsString()
  createdBy: string;
}
