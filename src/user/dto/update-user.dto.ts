import { PartialType } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsArray()
  knownLanguages: [string];
  @IsString()
  updatedBy: string;
}
