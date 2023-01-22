import { IsEmail, IsIn, IsString, IsOptional } from 'class-validator';
import {
  GENDERS_LIST,
  QUALIFICATIONS_LIST,
} from '../../common/constants/user.constant';
export class CreateUserDto {
  @IsOptional()
  parentId: string;
  @IsEmail()
  email: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  mobile: string;
  @IsString()
  @IsIn(GENDERS_LIST)
  gender: string;
  @IsString()
  @IsOptional()
  avatarId: string;
  @IsIn(QUALIFICATIONS_LIST)
  highestQualification: string;
  @IsString()
  roleId: string;
  @IsString()
  createdBy: string;
}
