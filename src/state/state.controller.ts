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
import { CreateStateDto } from './dto/create-state.dto';
import { FilterStateDto } from './dto/filter-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { StateService } from './state.service';

const routeName = 'states';

@ApiTags(routeName)
@ApiBearerAuth('token')
@Controller(routeName)
@Roles(ACCESS_TYPE.ADMIN)
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Public()
  @Get()
  findAll(@Query() filterStateDto: FilterStateDto) {
    return this.stateService.findAll(filterStateDto);
  }

  @Post()
  add(@Body() createStateDto: CreateStateDto) {
    return this.stateService.add(createStateDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStateDto: UpdateStateDto) {
    return this.stateService.update(id, updateStateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.stateService.delete(id);
  }
}
