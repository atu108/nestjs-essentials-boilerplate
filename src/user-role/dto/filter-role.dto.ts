import { IntersectionType, PartialType } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateRoleDto } from './create-role.dto';

export class FilterRoleDto extends PartialType(
  IntersectionType(CreateRoleDto, PaginationQueryDto),
) {}
