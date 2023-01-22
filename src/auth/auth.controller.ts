import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { RemoteAddress } from '../common/decorators/remote-address.decorator';
import { UserAgent } from '../common/decorators/user-agent.decorator';
import { User } from '../common/decorators/user.decorator';
import { UserInfoInToken } from '../common/types/user.types';
import { AuthService } from './auth.service';
import { GetMobileOtpDto } from './dto/get-mobile-otp.dto';
import { LoginMobileOtpDto } from './dto/login-mobile-otp.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const routeName = 'auth';
@ApiTags(routeName)
@Controller(routeName)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @RemoteAddress() ip,
    @UserAgent() ua,
  ) {
    return this.authService.login(loginDto, { ua, ip });
  }

  @Public()
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @RemoteAddress() ip,
    @UserAgent() ua,
  ) {
    const user = await this.authService.register(registerDto, {
      ua,
      ip,
    });
    return user;
  }

  //refreshTokenDto is any because we are setting this in token
  @ApiBearerAuth('token')
  @Get('refresh-token')
  async refreshToken(
    @User() user: UserInfoInToken,
    @RemoteAddress() ip: string,
    @UserAgent() ua: string,
  ) {
    return this.authService.refreshToken(user, ip, ua);
  }

  @Public()
  @Post('send-registration-otp')
  async sendRegisterOtp(@Body() registerOtpDto: GetMobileOtpDto) {
    return this.authService.sendRegistrationOtp(registerOtpDto);
  }

  @Public()
  @Post('send-login-otp')
  async sendLoginOtp(@Body() loginOtpDto: GetMobileOtpDto) {
    return this.authService.sendLoginOtp(loginOtpDto);
  }

  @Public()
  @Post('login-mobile')
  async loginWithMobileOtp(
    @Body() loginWithMobileOtpDto: LoginMobileOtpDto,
    @RemoteAddress() ip,
    @UserAgent() ua,
  ) {
    return this.authService.loginWithMobileOtp(loginWithMobileOtpDto, {
      ua,
      ip,
    });
  }
}
