import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { OtpModule } from '../otp/otp.module';
import { UserVerificationModule } from '../user-verification/user-verification.module';
import { UserRoleModule } from '../user-role/user-role.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { APPLICATION_NAME } from '../common/constants/app.constant';

@Module({
  imports: [
    SequelizeModule.forFeature([], APPLICATION_NAME),
    UserModule,
    OtpModule,
    UserVerificationModule,
    UserRoleModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
