import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ACCESS_TYPE } from '../common/constants/user.constant';
import { Roles } from '../common/decorators/roles.decorator';
import { UserAgent } from '../common/decorators/user-agent.decorator';
import { User } from '../common/decorators/user.decorator';
import { RoleType } from '../common/types/user.types';
import { generatePassword, toHash } from '../common/utils';
import { UserRoleService } from '../user-role/user-role.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { GetManagerDto } from './dto/get-manager.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

const routeName = 'users';
@ApiTags(routeName)
@ApiBearerAuth('token')
@Controller(routeName)
@Roles(ACCESS_TYPE.ADMIN)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: UserRoleService,
  ) {}

  @Get()
  findAll(@Query() filterUserDto: FilterUserDto, @User('role') role: RoleType) {
    return this.userService.findAll(filterUserDto, role);
  }

  @Post()
  async add(
    @Body() createUserDto: CreateUserDto,
    @User('role') access: RoleType,
  ) {
    if (
      access.level >
      (await this.roleService.findOne(createUserDto.roleId)).level
    ) {
      throw ForbiddenException;
    }
    const password = generatePassword(8);
    const hashedPassword = await toHash(password);
    createUserDto['password'] = hashedPassword;
    const user = await this.userService.add(createUserDto);
    /*
      Send Password on email
    */
    return user;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UserAgent('role') access: RoleType,
  ) {
    if (access.level > (await this.userService.findOne(id)).role.level) {
      throw ForbiddenException;
    }
    return this.userService.update(id, updateUserDto);
  }

  @Get('managers')
  getManagers(@Query() query: GetManagerDto) {
    return this.userService.getManagers(query.level);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @UserAgent('role') access: RoleType) {
    if (access.level > (await this.userService.findOne(id)).role.level) {
      throw ForbiddenException;
    }
    return this.userService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
