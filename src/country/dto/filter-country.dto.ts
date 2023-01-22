import { IntersectionType, PartialType } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateCountryDto } from './create-country.dto';

export class FilterCountryDto extends PartialType(
  IntersectionType(CreateCountryDto, PaginationQueryDto),
) {}
