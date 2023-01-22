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
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { FilterCityDto } from './dto/filter-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

const routeName = 'cities';

@ApiTags(routeName)
@ApiBearerAuth('token')
@Controller(routeName)
@Roles(ACCESS_TYPE.ADMIN)
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Public()
  @Get()
  findAll(@Query() filterCityDto: FilterCityDto) {
    return this.cityService.findAll(filterCityDto);
  }

  @Post()
  add(@Body() createCityDto: CreateCityDto) {
    return this.cityService.add(createCityDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.cityService.update(id, updateCityDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.cityService.delete(id);
  }
}
