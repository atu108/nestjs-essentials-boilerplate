import { IntersectionType, PartialType } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreatePinCodeDto } from './create-pincode.dto';

export class FilterPinCodeDto extends PartialType(
  IntersectionType(CreatePinCodeDto, PaginationQueryDto),
) {}
