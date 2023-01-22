import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PinCode } from './entities/pin-code.entity';
import { PinCodeController } from './pin-code.controller';
import { PinCodeService } from './pin-code.service';

@Module({
  imports: [SequelizeModule.forFeature([PinCode])],
  controllers: [PinCodeController],
  providers: [PinCodeService],
})
export class PinCodeModule {}
