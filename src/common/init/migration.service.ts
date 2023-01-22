import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRoleService } from '../../user-role/user-role.service';
import { UserVerificationService } from '../../user-verification/user-verification.service';
import { UserService } from '../../user/user.service';
import { FIRST_ADMIN_EMAIL } from '../constants/app.constant';
import { ACCESS_TYPE, QUALIFICATIONS } from '../constants/user.constant';
import { generatePassword, toHash } from '../utils';

@Injectable()
export class MigrationService {
  constructor(
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
    private readonly userVerificationService: UserVerificationService,
    private readonly configService: ConfigService,
  ) {}
  /*
      To do
      Import config module! Prevent from query to be called when DB_RESET is false
  */
  onModuleInit() {
    if (
      this.configService.get('environment') == 'development' &&
      this.configService.get('db.reset')
    ) {
      this.init().then(() => {
        console.info('Data Migrataed');
      });
    }
  }

  async createAdminUser(roleId) {
    const password = generatePassword(8);
    const hashedPassword = await toHash(password);
    return this.userService.add({
      email: FIRST_ADMIN_EMAIL,
      firstName: 'Iweb',
      lastName: 'admin',
      mobile: '8602723622',
      gender: 'MALE',
      dob: '22-08-1992',
      avatar: 'test',
      fathersName: 'Test',
      password: hashedPassword,
      highestQualification: QUALIFICATIONS['BACHELORS'],
      roleId: roleId,
    });
  }

  async createAllRolesAndReturnAdminRole() {
    await this.userRoleService.addAllRoles();
    return this.userRoleService.findRoleByName(ACCESS_TYPE['ADMIN']);
  }

  async init() {
    const adminUser = await this.userService.findOneByEmail(FIRST_ADMIN_EMAIL);
    if (!adminUser) {
      const role = await this.createAllRolesAndReturnAdminRole();
      const admin = await this.createAdminUser(role.id);
      await this.userVerificationService.addRequiredVerification(
        admin.id,
        false,
        true,
      );
    }
  }
}
