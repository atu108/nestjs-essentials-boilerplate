import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserVerification } from './entities/user-verification.entity';
import { UserVerificationController } from './user-verification.controller';
import { UserVerificationService } from './user-verification.service';

@Module({
  imports: [SequelizeModule.forFeature([UserVerification])],
  providers: [UserVerificationService],
  controllers: [UserVerificationController],
  exports: [UserVerificationService],
})
export class UserVerificationModule {}
