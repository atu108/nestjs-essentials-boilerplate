import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { FilterCountryDto } from './dto/filter-country.dto';
import { Country } from './entities/country.entity';

@Injectable()
export class CountryService {
  constructor(@InjectModel(Country) private country: typeof Country) {}

  async findAll(query: FilterCountryDto) {
    const {
      limit,
      page,
      sortBy = 'name',
      sortOrder,
      name,
      status,
      isDropdown,
    } = query;
    const condition = { status };
    if (name) {
      condition['name'] = { [Op.like]: `%${name}%` };
    }
    if (isDropdown) {
      const { rows, count } = await this.country.findAndCountAll({
        where: condition,
        order: [[sortBy, sortOrder]],
      });
      return {
        rows,
        count,
      };
    }
    const { rows, count } = await this.country.findAndCountAll({
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
    return this.country.findByPk(id);
  }

  add(data) {
    return this.country.create(data);
  }

  async update(id: string, data) {
    await this.country.update(data, {
      where: { id },
    });
    return this.findOne(id);
  }

  delete(id: string) {
    this.country.destroy({
      where: { id },
    });
  }
}
