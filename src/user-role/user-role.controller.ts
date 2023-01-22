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
import { CreateRoleDto } from './dto/create-role.dto';
import { FilterRoleDto } from './dto/filter-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserRoleService } from './user-role.service';

const routeName = 'user-roles';
@ApiTags(routeName)
@ApiBearerAuth('token')
@Controller(routeName)
@Roles(ACCESS_TYPE.ADMIN)
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Get()
  findAll(@Query() filterRoleDto: FilterRoleDto) {
    return this.userRoleService.findAll(filterRoleDto);
  }

  @Post()
  add(@Body() createRoleDto: CreateRoleDto) {
    return this.userRoleService.add(createRoleDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.userRoleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userRoleService.delete(id);
  }
}
