import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OtpModule } from '../otp/otp.module';
import { UserRoleModule } from '../user-role/user-role.module';
import { UserVerificationModule } from '../user-verification/user-verification.module';
import { User } from './entities/user.entity';
import { MeController } from './me.controller';
import { UserController } from './user.controller';
import { UserService } from './user.service';
@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    UserVerificationModule,
    OtpModule,
    UserRoleModule,
  ],
  controllers: [UserController, MeController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
