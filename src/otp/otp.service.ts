import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import {
  DATE_FORMAT,
  OTP_PURPOSE_TYPE,
  OTP_VALIDITY,
  SORT_ORDER,
} from '../common/constants/app.constant';
import { Otp } from './entities/otp.entity';
import * as moment from 'moment';
import { CreateOtpDto } from './dto/create-otp.dto';
import { checkHash } from '../common/utils';

@Injectable()
export class OtpService {
  constructor(@InjectModel(Otp) private readonly otp: typeof Otp) {}

  add(createOtpDto: CreateOtpDto) {
    createOtpDto['validTill'] = moment
      .utc()
      .add(OTP_VALIDITY, 'minutes')
      .format(DATE_FORMAT);
    return this.otp.create({ ...createOtpDto });
  }

  getOtp(
    purpose: OTP_PURPOSE_TYPE,
    mobile?: string,
    userId?: string,
    options?: { isVerified?: boolean; updateAttempt?: boolean },
  ) {
    const currentTimestamp = moment.utc().format(DATE_FORMAT);
    const condition = {
      purpose,
      validTill: { [Op.gt]: currentTimestamp },
    };
    if (mobile) {
      condition['mobile'] = mobile;
    }
    if (userId) {
      condition['userId'] = userId;
    }
    if (options?.isVerified) {
      condition['isVerified'] = options.isVerified;
      delete condition.validTill;
    }
    if (options?.updateAttempt) {
      /*
        To do
      */
    }
    return this.otp.findOne({
      where: condition,
      order: [['updatedAt', SORT_ORDER['DESC']]],
    });
  }

  getOtpByPhoneNumber(mobile, purpose) {
    return this.getOtp(purpose, mobile);
  }

  getOtpByUserId(userId, purpose) {
    return this.getOtp(purpose, null, userId);
  }

  isOtpVerified(mobile, purpose) {
    return this.getOtp(purpose, mobile, null, { isVerified: true });
  }

  isUserOtpVeirifed(userId, purpose) {
    return this.getOtp(purpose, null, userId, { isVerified: true });
  }

  async isMobileOtpValid(mobile, userId, purpose, code) {
    const otp = await this.getOtpByPhoneNumber(mobile, purpose);
    if (!otp) return false;
    if (!(await checkHash(`${code}`, otp.code))) return false;
    await this.invalidateOtp(mobile, null, purpose, true);
    return true;
  }

  async isUserOtpValid(userId, purpose, code) {
    const otp = await this.getOtpByUserId(userId, purpose);
    if (!otp) return false;
    if (!(await checkHash(`${code}`, otp.code))) return false;
    await this.invalidateOtp(null, userId, purpose, true);
    return true;
  }

  invalidateOtp(mobile, userId, purpose, isVerified = false) {
    const currentDate = moment
      .utc()
      .subtract(OTP_VALIDITY, 'minutes')
      .format(DATE_FORMAT);
    this.otp.update(
      { validTill: currentDate, isVerified },
      { where: { mobile, userId, purpose } },
    );
  }
}
