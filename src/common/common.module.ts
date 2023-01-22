import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { UserRoleModule } from '../user-role/user-role.module';
import { UserVerificationModule } from '../user-verification/user-verification.module';
import { UserModule } from '../user/user.module';
import { MigrationService } from './init/migration.service';

@Global()
@Module({
  imports: [UserModule, UserRoleModule, ConfigService, UserVerificationModule],
  providers: [
    MigrationService,
    { provide: 'SEQUELIZE', useExisting: Sequelize },
  ],
})
export class CommonModule {}
