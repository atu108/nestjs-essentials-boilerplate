import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { FilterPinCodeDto } from './dto/filter-pincode.dto';
import { PinCode } from './entities/pin-code.entity';

@Injectable()
export class PinCodeService {
  constructor(@InjectModel(PinCode) private pinCode: typeof PinCode) {}

  async findAll(query: FilterPinCodeDto) {
    const {
      limit,
      page,
      status,
      sortBy = 'area',
      sortOrder,
      pin,
      area,
      cityId,
      isDropdown,
    } = query;
    const condition = { status };
    if (pin) {
      condition['pin'] = pin;
    }
    if (area) {
      condition['area'] = { [Op.like]: `%${area}%` };
    }
    if (cityId) {
      condition['cityId'] = cityId;
    }
    if (isDropdown) {
      const { rows, count } = await this.pinCode.findAndCountAll({
        where: condition,
        order: [[sortBy, sortOrder]],
      });
      return {
        rows,
        count,
      };
    }
    const { rows, count } = await this.pinCode.findAndCountAll({
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
    return this.pinCode.findByPk(id);
  }

  add(data) {
    return this.pinCode.create(data);
  }

  async update(id: string, data) {
    await this.pinCode.update(data, {
      where: { id },
    });
    return this.findOne(id);
  }

  delete(id: string) {
    this.pinCode.destroy({
      where: { id },
    });
  }
}
