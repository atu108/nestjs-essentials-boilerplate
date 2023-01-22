import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  DeletedAt,
  AllowNull,
  ForeignKey,
  Unique,
  Default,
  DefaultScope,
} from 'sequelize-typescript';
import {
  ACCESS_TYPE_LIST,
  STATUS,
  STATUS_LIST,
} from '../../common/constants/user.constant';
import { User } from '../../user/entities/user.entity';

@DefaultScope(() => ({
  attributes: ['id', 'name', 'level'],
}))
@Table
export class UserRole extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Unique
  @Column({
    type: DataType.ENUM({
      values: ACCESS_TYPE_LIST,
    }),
  })
  name: string;

  @Column(DataType.STRING)
  description: string;

  @Default(STATUS['ACTIVE'])
  @Column({
    type: DataType.ENUM({
      values: STATUS_LIST,
    }),
  })
  status: string;

  @Column(DataType.INTEGER)
  level: number;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  createdBy: string;

  @DeletedAt
  deletedAt: Date;

  @AllowNull
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  deletedBy: string;
}
