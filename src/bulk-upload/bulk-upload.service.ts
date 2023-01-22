import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { City } from '../city/entities/city.entity';
import { bulkUploadDataMap } from '../common/constants/bulk-upload.constant';
import { createExcel, excelToJson } from '../common/utils/helpers';
import { Country } from '../country/entities/country.entity';
import { PinCode } from '../pin-code/entities/pin-code.entity';
import { State } from '../state/entities/state.entity';
import { UserRole } from '../user-role/entities/user-role.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class BulkUploadService {
  constructor(
    @InjectModel(Country) private country: typeof Country,
    @InjectModel(State) private state: typeof State,
    @InjectModel(City) private city: typeof City,
    @InjectModel(PinCode) private pinCode: typeof PinCode,
    @InjectModel(UserRole) private userRole: typeof UserRole,
    @InjectModel(User) private user: typeof User,
    private config: ConfigService,
  ) {}

  async getExcel(type) {
    const headers = bulkUploadDataMap[type];
    const basePath = this.config.get('excelFilePath');
    return await createExcel(headers, basePath, type);
  }

  validateExcel(requiredFields, passed) {
    if (!passed) {
      throw new HttpException(`Can not process empty excel`, 400);
    }
    requiredFields.forEach((field) => {
      if (!passed[field])
        throw new HttpException(
          `Invalid Excel ! Column ${field} is missing !`,
          400,
        );
    });
  }

  stateRows = async (rows, data) => {
    const states = await this.state.findAll();
    const statesMap = {};
    states.forEach(
      (state) => (statesMap[state['name'].toLowerCase()] = state['id']),
    );
    const generateRows = [];
    rows.forEach((row) => {
      if (statesMap[row['state'].toLowerCase()]) {
        const rowCopy = { ...row };
        rowCopy['stateId'] = statesMap[row['state'].toLowerCase()];
        rowCopy['createdBy'] = data.createdBy;
        generateRows.push(rowCopy);
      }
    });
    return generateRows;
  };

  async addCreatedBy(rows, data) {
    const generateRows = rows.map((row) => {
      row = Object.assign(row, { createdBy: data.createdBy });
      return row;
    });
    return generateRows;
  }
  async bulkAdding(file, data) {
    const rows = excelToJson(file);
    const type = data.type;
    this.validateExcel(bulkUploadDataMap[type], rows[0]);

    switch (type) {
      case 'COUNTRY': {
        const generateRows = await this.addCreatedBy(rows, data);
        return await this.country.bulkCreate(generateRows, {
          ignoreDuplicates: true,
        });
      }

      case 'STATE': {
        
      }

      case 'CITY': {
        const generateRows = await this.stateRows(rows, data);
        return await this.city.bulkCreate(generateRows, {
          ignoreDuplicates: true,
        });
      }

      case 'PIN_CODE': {
        const cities = await this.city.findAll();
        const citiesMap = {};
        cities.forEach(
          (city) => (citiesMap[city['name'].toLowerCase()] = city['id']),
        );
        const generateRows = [];
        rows.forEach((row) => {
          if (citiesMap[row['city'].toLowerCase()]) {
            const rowCopy = { ...row };
            rowCopy['cityId'] = citiesMap[row['city'].toLowerCase()];
            rowCopy['createdBy'] = data.createdBy;
            generateRows.push(rowCopy);
          }
        });
        return await this.pinCode.bulkCreate(generateRows, {
          ignoreDuplicates: true,
        });
      }

      case 'USER_ROLE': {
        const generateRows = await this.addCreatedBy(rows, data);
        return await this.userRole.bulkCreate(generateRows, {
          ignoreDuplicates: true,
        });
      }

      case 'user': {
        const userRoles = await this.userRole.findAll();
        const userRolesMap = {};
        userRoles.forEach(
          (userRole) =>
            (userRolesMap[userRole['name'].toLowerCase()] = userRole['id']),
        );
        const generateRows = [];
        rows.forEach((row) => {
          if (userRolesMap[row['userRole'].toLowerCase()]) {
            const rowCopy = { ...row };
            rowCopy['userRoleId'] = userRolesMap[row['userRole'].toLowerCase()];
            rowCopy['createdBy'] = data.createdBy;
            generateRows.push(rowCopy);
          }
        });
        return await this.user.bulkCreate(generateRows, {
          ignoreDuplicates: true,
        });
      }

      default: {
        return null;
      }
    }
  }
}
