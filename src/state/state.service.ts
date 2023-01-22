import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { FilterStateDto } from './dto/filter-state.dto';
import { State } from './entities/state.entity';

@Injectable()
export class StateService {
  constructor(@InjectModel(State) private state: typeof State) {}
  async findAll(query: FilterStateDto) {
    const {
      limit,
      page,
      sortBy = 'name',
      sortOrder,
      name,
      status,
      zoneId,
      isDropdown,
    } = query;
    const condition = { status };
    if (name) {
      condition['name'] = { [Op.like]: `%${name}%` };
    }
    if (zoneId) {
      condition['zoneId'] = zoneId;
    }
    if (isDropdown) {
      const { rows, count } = await this.state.findAndCountAll({
        where: condition,
        order: [[sortBy, sortOrder]],
      });
      return {
        rows,
        count,
      };
    }

    const { rows, count } = await this.state.findAndCountAll({
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
    return this.state.findByPk(id);
  }

  add(data) {
    return this.state.create(data);
  }

  async update(id: string, data) {
    await this.state.update(data, {
      where: { id },
    });
    return this.findOne(id);
  }

  delete(id: string) {
    this.state.destroy({
      where: { id },
    });
  }
}
