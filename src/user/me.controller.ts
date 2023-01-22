import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ACCESS_TYPE,
} from '../common/constants/user.constant';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from '../common/decorators/user.decorator';
import { UserInfoInToken } from '../common/types/user.types';
import { UserRoleService } from '../user-role/user-role.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserService } from './user.service';

const routeName = 'user';
@ApiTags(routeName)
@ApiBearerAuth('token')
@Controller(routeName)
@Roles(ACCESS_TYPE.FSE, ACCESS_TYPE.TL)
export class MeController {
  constructor(
    private readonly userService: UserService,
    private readonly roleServices: UserRoleService,
  ) {}

  @Post('email-verification-otp')
  sendEmailOtp(@User() user: UserInfoInToken) {
    return this.userService.sendEmailVerificationOtp(user);
  }

  @Post('verify-email')
  verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
    @User() user: UserInfoInToken,
  ) {
    return this.userService.verifyEmail(user, verifyEmailDto.otp);
  }

  @Public()
  @Get('roles')
  getRoles() {
    return this.roleServices.selfRegistrationAllowedRoles();
  }

  @Get('profile')
  profile(@User('id') userId: string) {
    return this.userService.findOne(userId, true);
  }
}
