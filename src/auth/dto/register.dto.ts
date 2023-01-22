import { OmitType } from '@nestjs/swagger';
import { IsNumber, IsString, Matches } from 'class-validator';
import { CreateUserDto } from '../../user/dto/create-user.dto';

export class RegisterDto extends OmitType(CreateUserDto, [
  'createdBy',
  'parentId',
] as const) {
  @IsString()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;
  @IsNumber()
  otp: number;
  @IsString()
  preferedCity: string;
  @IsString()
  preferedPin: string;
}
