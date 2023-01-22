import { PickType } from '@nestjs/swagger';
import { UpdateUserDto } from './update-user.dto';

export class ProfileInfoDto extends PickType(UpdateUserDto, [
  'avatarId',
  'updatedBy',
  'knownLanguages',
]) {}
