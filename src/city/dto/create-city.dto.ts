import { IsString } from 'class-validator';

export class CreateCityDto {
  @IsString()
  name: string;
  @IsString()
  stateId: string;
  @IsString()
  createdBy: string;
}
