import { IntersectionType, PartialType } from '@nestjs/swagger/dist';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateUserDto } from './create-user.dto';

export class FilterUserDto extends PartialType(
  IntersectionType(CreateUserDto, PaginationQueryDto),
) {}
