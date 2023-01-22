import { Controller, Patch, Param } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ACCESS_TYPE } from '../common/constants/user.constant';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdatedBy } from '../common/decorators/updatedBy.decorator';
import { UserVerificationService } from './user-verification.service';

const routeName = 'verify-kyc';

@ApiTags(routeName)
@ApiBearerAuth('token')
@Controller(routeName)
@Roles(ACCESS_TYPE.ADMIN)
export class UserVerificationController {
  constructor(
    private readonly userVerificationService: UserVerificationService,
  ) {}

  @Patch('/approve/:userId')
  approveKyc(@Param('userId') userId: string, @UpdatedBy() updatedBy: string) {
    return this.userVerificationService.updateVerification(
      userId,
      updatedBy,
      'KYC',
    );
  }

  @Patch('/reject/:userId')
  rejectKyc(@Param('userId') userId: string, @UpdatedBy() updatedBy: string) {
    return this.userVerificationService.updateVerification(
      userId,
      updatedBy,
      'KYC',
      false,
    );
  }
}
