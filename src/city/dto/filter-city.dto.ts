import { IntersectionType, PartialType } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateCityDto } from './create-city.dto';

export class FilterCityDto extends PartialType(
  IntersectionType(CreateCityDto, PaginationQueryDto),
) {}
