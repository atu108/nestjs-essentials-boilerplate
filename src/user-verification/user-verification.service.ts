import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserVerification } from './entities/user-verification.entity';

@Injectable()
export class UserVerificationService {
  private verificationTypes = {
    EMAIL: 'isEmailVerified',
    MOBILE: 'isMobileVerified',
    KYC: 'isKycVerified',
  };

  constructor(
    @InjectModel(UserVerification)
    private userVerification: typeof UserVerification,
  ) {}

  addRequiredVerification(
    userId,
    isMobileVerified = false,
    isEmailVerified = false,
  ) {
    return this.userVerification.create({
      userId,
      isMobileVerified,
      isEmailVerified,
    });
  }

  updateVerification(
    userId,
    updatedBy,
    verificationType: 'EMAIL' | 'MOBILE' | 'KYC',
    isVerified = true,
  ) {
    return this.userVerification.update(
      { [this.verificationTypes[verificationType]]: isVerified, updatedBy },
      { where: { userId } },
    );
  }

  getVerifications(userId) {
    return this.userVerification.findOne({ where: { userId } });
  }

  private isVerified(userId, verificationType?: 'EMAIL' | 'MOBILE' | 'KYC') {
    return this.userVerification.findOne({
      where: { userId, [this.verificationTypes[verificationType]]: true },
    });
  }

  isMobileVerified(userId) {
    return this.isVerified(userId, 'MOBILE');
  }

  isEmailVerified(userId) {
    return this.isVerified(userId, 'EMAIL');
  }

  isKycVerified(userId) {
    return this.isVerified(userId, 'KYC');
  }
}
