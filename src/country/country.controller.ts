import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ACCESS_TYPE } from '../common/constants/user.constant';
import { Roles } from '../common/decorators/roles.decorator';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { FilterCountryDto } from './dto/filter-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

const routeName = 'countries';

@ApiTags(routeName)
@ApiBearerAuth('token')
@Controller(routeName)
@Roles(ACCESS_TYPE.ADMIN)
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  findAll(@Query() filterCountryDto: FilterCountryDto) {
    return this.countryService.findAll(filterCountryDto);
  }

  @Post()
  add(@Body() createCountryDto: CreateCountryDto) {
    return this.countryService.add(createCountryDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countryService.update(id, updateCountryDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.countryService.delete(id);
  }
}
