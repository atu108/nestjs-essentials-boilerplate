import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { City } from '../city/entities/city.entity';
import { Country } from '../country/entities/country.entity';
import { PinCode } from '../pin-code/entities/pin-code.entity';
import { State } from '../state/entities/state.entity';
import { UserRole } from '../user-role/entities/user-role.entity';
import { User } from '../user/entities/user.entity';
import { BulkUploadController } from './bulk-upload.controller';
import { BulkUploadService } from './bulk-upload.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Country,
      State,
      City,
      PinCode,
      UserRole,
      User,
    ]),
  ],
  controllers: [BulkUploadController],
  providers: [BulkUploadService],
})
export class BulkUploadModule {}
