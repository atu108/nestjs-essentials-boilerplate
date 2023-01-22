import { UserService } from '../user/user.service';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config';

import { checkHash, generateAndHashOtp, toHash } from '../common/utils/helpers';
import { OtpService } from '../otp/otp.service';
import { OTP_PURPOSE, OTP_VALIDITY } from '../common/constants/app.constant';
import { ADDRESS_TYPES } from '../common/constants/user.constant';
import { RegisterDto } from './dto/register.dto';
import { UserVerificationService } from '../user-verification/user-verification.service';
import { UserRoleService } from '../user-role/user-role.service';
import { Transaction } from '../common/decorators/transaction.decorator';
import { UserInfoInToken } from '../common/types/user.types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => JwtService)) private readonly jwt: JwtService,
    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly userVerificationService: UserVerificationService,
    private readonly userRoleService: UserRoleService,
    private config: ConfigService,
  ) {}

  async passwordHash(password: string) {
    const hash: string = await toHash(password);
    return {
      password: password,
      hash: hash,
    };
  }

  private getTokens(user: UserInfoInToken, ip: string, ua: string) {
    const payload: any = {
      ua,
      ip,
      user,
    };
    const token: string = this.jwt.sign(payload);
    const refreshToken: string = this.jwt.sign(payload, {
      expiresIn: this.config.get('JWT_REFRESH_EXPIRY'),
    });

    return {
      token,
      refreshToken,
    };
  }

  async validate(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await checkHash(password, user.password);

    if (isValid) {
      user.password = undefined;
      return user;
    }

    return null;
  }

  async login({ email, password }: any, { ip, ua }: any) {
    const user = await this.validate(email, password);
    if (!user) {
      throw new HttpException('Invalid Credentials', 401);
    }
    if (!this.userVerificationService.isEmailVerified(user.id)) {
      throw new HttpException('Email not verified', 401);
    }
    return {
      statusCode: HttpStatus.ACCEPTED,
      ...this.getTokens(user, ip, ua),
      user,
    };
  }

  async loginWithMobileOtp({ mobile, otp }, { ip, ua }: any) {
    if (
      !(await this.otpService.isMobileOtpValid(
        mobile,
        null,
        OTP_PURPOSE['LOGIN'],
        otp,
      ))
    ) {
      throw new HttpException('Invalid Otp', 401);
    }
    const user = await this.userService.findOneByMobile(mobile);
    return {
      statusCode: HttpStatus.ACCEPTED,
      ...this.getTokens(user, ip, ua),
      user,
    };
  }

  @Transaction()
  async register(data: RegisterDto, { ip, ua }) {
    const { otp, mobile, password, preferedCity, preferedPin, roleId } = data;
    if (
      !(await this.otpService.isMobileOtpValid(
        mobile,
        null,
        OTP_PURPOSE['VERIFY_MOBILE'],
        otp,
      ))
    ) {
      throw new HttpException('Invalid Otp', 401);
    }

    const roles = await this.userRoleService.selfRegistrationAllowedRoleIds();
    if (!roles.includes(roleId)) {
      throw new HttpException('Invalid Role Selected', 400);
    }
    const hash: string = await toHash(password);
    const createdUser = await this.userService.add({
      ...data,
      password: hash,
    });

    await this.userVerificationService.addRequiredVerification(
      createdUser.id,
      true,
    );

    return {
      statusCode: HttpStatus.ACCEPTED,
      ...this.getTokens(createdUser, ip, ua),
      user: createdUser,
    };
  }

  async sendRegistrationOtp({ mobile }) {
    if (await this.userService.findOneByMobile(mobile)) {
      throw new HttpException('User already registered', 409);
    }
    await this.createAndSendRegistrationOtp(mobile);
    return { message: 'Otp Sent', retry: OTP_VALIDITY * 60 };
  }

  async sendLoginOtp({ mobile }) {
    if (!(await this.userService.findOneByMobile(mobile))) {
      throw new HttpException('User not registered', 403);
    }
    await this.createAndSendLoginOtp(mobile);
    return { message: 'Otp Sent', retry: OTP_VALIDITY * 60 };
  }

  async refreshToken(user, ip, ua) {
    return this.getTokens(user, ip, ua);
  }

  async createAndSendRegistrationOtp(mobile) {
    await this.createAndSendMobileOtp(mobile, OTP_PURPOSE['VERIFY_MOBILE']);
  }

  async createAndSendLoginOtp(mobile) {
    await this.createAndSendMobileOtp(mobile, OTP_PURPOSE['LOGIN']);
  }

  async createAndSendMobileOtp(mobile, purpose) {
    const [mobileOtp, hashedMobileOtp] = await generateAndHashOtp();
    await this.otpService.add({
      mobile,
      code: hashedMobileOtp,
      purpose,
    });
    //await this.sendMobileOtp(mobile, mobileOtp);
  }
}
