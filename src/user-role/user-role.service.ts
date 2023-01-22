import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import {
  ACCESS_TYPE_LIST,
  SELF_REGISTRATION_ALLOWED_ROLES,
  USER_ROLES_LEVEL,
} from '../common/constants/user.constant';
import { FilterRoleDto } from './dto/filter-role.dto';
import { UserRole } from './entities/user-role.entity';

@Injectable()
export class UserRoleService {
  constructor(@InjectModel(UserRole) private userRole: typeof UserRole) {}

  async findAll(query: FilterRoleDto) {
    const {
      limit,
      page,
      sortBy = 'level',
      sortOrder,
      name,
      description,
      status,
      isDropdown,
    } = query;
    const condition = { status };
    if (name) {
      condition['name'] = name;
    }
    if (description) {
      condition['description'] = { [Op.like]: `%${description}%` };
    }
    if (isDropdown) {
      const { rows, count } = await this.userRole.findAndCountAll({
        where: condition,
        order: [[sortBy, sortOrder]],
      });
      return {
        rows,
        count,
      };
    }
    const { rows, count } = await this.userRole.findAndCountAll({
      where: condition,
      offset: (page - 1) * limit,
      limit,
      order: [[sortBy, sortOrder]],
    });
    return {
      rows,
      count,
      page,
      limit,
    };
  }

  findOne(id) {
    return this.userRole.findByPk(id);
  }

  add(data) {
    data['level'] = USER_ROLES_LEVEL[data['name']];
    return this.userRole.create(data);
  }

  findRoleByName(name) {
    return this.userRole.findOne({ where: { name } });
  }

  addAllRoles() {
    return this.userRole.bulkCreate(
      ACCESS_TYPE_LIST.map((accessType) => {
        return { name: accessType, level: USER_ROLES_LEVEL[accessType] };
      }),
    );
  }

  async selfRegistrationAllowedRoles() {
    const roles = await this.userRole.findAll({
      where: { name: { [Op.in]: SELF_REGISTRATION_ALLOWED_ROLES } },
    });
    return roles;
  }

  async selfRegistrationAllowedRoleIds() {
    const roles = await this.selfRegistrationAllowedRoles();
    return roles.map((r) => r.id);
  }

  async update(id: string, data) {
    if (data['name']) {
      data['level'] = USER_ROLES_LEVEL[data['name']];
    }
    await this.userRole.update(data, {
      where: { id },
    });
    return this.findOne(id);
  }

  delete(id: string) {
    this.userRole.destroy({
      where: { id },
    });
  }
}
