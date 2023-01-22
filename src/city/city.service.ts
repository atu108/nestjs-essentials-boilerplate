import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { FilterCityDto } from './dto/filter-city.dto';
import { City } from './entities/city.entity';

@Injectable()
export class CityService {
  constructor(@InjectModel(City) private city: typeof City) {}

  async findAll(query: FilterCityDto) {
    const {
      limit,
      page,
      sortBy = 'name',
      sortOrder,
      name,
      status,
      stateId,
      isDropdown,
    } = query;
    const condition = { status };
    if (name) {
      condition['name'] = { [Op.like]: `%${name}%` };
    }
    if (stateId) {
      condition['stateId'] = stateId;
    }
    if (isDropdown) {
      const { rows, count } = await this.city.findAndCountAll({
        where: condition,
        order: [[sortBy, sortOrder]],
      });
      return {
        rows,
        count,
      };
    }
    const { rows, count } = await this.city.findAndCountAll({
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
    return this.city.findByPk(id);
  }

  add(data) {
    return this.city.create(data);
  }

  async update(id: string, data) {
    await this.city.update(data, {
      where: { id },
    });
    return this.findOne(id);
  }

  delete(id: string) {
    this.city.destroy({
      where: { id },
    });
  }
}
