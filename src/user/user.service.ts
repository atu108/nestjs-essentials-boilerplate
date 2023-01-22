import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { OTP_PURPOSE, OTP_VALIDITY } from '../common/constants/app.constant';
import { STATUS } from '../common/constants/user.constant';
import { RoleType } from '../common/types/user.types';
import { generateAndHashOtp } from '../common/utils';
import { OtpService } from '../otp/otp.service';
import { UserRole } from '../user-role/entities/user-role.entity';
import { UserVerificationService } from '../user-verification/user-verification.service';
import { FilterUserDto } from './dto/filter-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private user: typeof User,
    private readonly otpService: OtpService,
    private readonly userVerificationService: UserVerificationService,
  ) {}
  async findAll(query: FilterUserDto, accessedBy: RoleType) {
    const {
      limit,
      page,
      sortBy = 'createdAt',
      sortOrder,
      email,
      status,
      isDropdown,
      firstName,
      lastName,
      mobile,
      gender,
      highestQualification,
      roleId,
    } = query;

    const condition = {};
    if (status != 'ANY') {
      condition['status'] = status;
    }
    if (email) {
      condition['email'] = { [Op.like]: `%${email}%` };
    }
    if (firstName) {
      condition['firstName'] = { [Op.like]: `%${firstName}%` };
    }
    if (lastName) {
      condition['lastName'] = { [Op.like]: `%${lastName}%` };
    }
    if (mobile) {
      condition['mobile'] = { [Op.like]: `%${mobile}%` };
    }
    if (gender) {
      condition['gender'] = gender;
    }
    if (highestQualification) {
      condition['highestQualification'] = highestQualification;
    }
    if (roleId) {
      condition['roleId'] = roleId;
    }
    if (isDropdown) {
      const { rows, count } = await this.user.findAndCountAll({
        where: condition,
        include: [
          { model: UserRole, where: { level: { [Op.gt]: accessedBy.level } } },
        ],
        order: [[sortBy, sortOrder]],
      });
      return {
        rows,
        count,
      };
    }
    const { rows, count } = await this.user.findAndCountAll({
      where: condition,
      include: [
        { model: UserRole, where: { level: { [Op.gt]: accessedBy.level } } },
      ],
      offset: (page - 1) * limit,
      limit,
      order: [[sortBy, sortOrder]],
    });
    return {
      rows,
      count,
      page,
      limit,
    };
  }

  findOne(id, isProfile = false) {
    if (isProfile) {
      return this.user
        .scope(['defaultScope', 'withDependents', 'withKycSteps'])
        .findByPk(id);
    }
    return this.user.scope(['defaultScope', 'withDependents']).findByPk(id);
  }

  getManagers(forLevel) {
    if (!+forLevel) {
      throw new HttpException('Invalid Level', 400);
    }
    return this.user.findAll({
      include: [{ model: UserRole, where: { level: { [Op.lt]: forLevel } } }],
    });
  }

  findOneByEmail(email) {
    return this.user.findOne({
      where: { email },
      attributes: [
        'id',
        'email',
        'firstName',
        'lastName',
        'password',
        'status',
      ],
    });
  }

  findOneByMobile(mobile) {
    return this.user.findOne({
      where: { mobile },
      attributes: ['id', 'email', 'firstName', 'lastName', 'status'],
    });
  }

  async update(id: string, data) {
    await this.user.update(data, {
      where: { id },
    });
    return this.findOne(id);
  }

  async add(data) {
    const user = await this.user.create(data);
    return this.findOne(user.id);
  }

  delete(id: string) {
    this.user.destroy({
      where: { id },
    });
  }

  async verifyEmail(user, otp) {
    if (
      !this.otpService.isUserOtpValid(user.id, OTP_PURPOSE['VERIFY_EMAIL'], otp)
    ) {
      throw new UnauthorizedException('Invalid Otp');
    }
    await this.userVerificationService.updateVerification(
      user.id,
      user.id,
      'EMAIL',
      true,
    );
    return { message: 'Verified' };
  }

  async sendEmailVerificationOtp({ id, email, roleId }) {
    await this.createAndSendEmailOtp(id, email, OTP_PURPOSE['VERIFY_EMAIL']);
    return { message: 'Otp sent', retry: OTP_VALIDITY * 60 };
  }

  async createAndSendEmailOtp(userId, email, purpose) {
    const [emailOpt, hashedEmailOtp] = await generateAndHashOtp();
    return await this.otpService.add({
      userId,
      code: hashedEmailOtp,
      purpose,
    });
    //await this.sendEmailOtp(email, emailOpt);
  }

  changeStatus(id, status) {
    return this.update(id, { status });
  }

  activateUser(id) {
    return this.changeStatus(id, STATUS['ACTIVE']);
  }
}
