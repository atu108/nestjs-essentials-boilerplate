import { IntersectionType, PartialType } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateStateDto } from './create-state.dto';

export class FilterStateDto extends PartialType(
  IntersectionType(CreateStateDto, PaginationQueryDto),
) {}
