import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  Unique,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  ForeignKey,
  Default,
  DeletedAt,
  BelongsTo,
  DefaultScope,
} from 'sequelize-typescript';
import { City } from '../../city/entities/city.entity';
import { STATUS, STATUS_LIST } from '../../common/constants/user.constant';
import { User } from '../../user/entities/user.entity';

@DefaultScope(() => ({
  include: [{ model: City, attributes: ['id', 'name'] }],
}))
@Table
export class PinCode extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Unique
  @Column(DataType.STRING)
  pin: string;

  @Unique
  @Column(DataType.STRING)
  area: string;

  @ForeignKey(() => City)
  @Column(DataType.UUID)
  cityId: string;

  @BelongsTo(() => City, 'cityId')
  city: City;

  @Default(STATUS['ACTIVE'])
  @Column({
    type: DataType.ENUM({
      values: STATUS_LIST,
    }),
  })
  status: string;

  @CreatedAt
  createdAt: Date;

  @AllowNull
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  createdBy: string;

  @UpdatedAt
  updatedAt: Date;

  @AllowNull
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  updatedBy: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  deactivatedBy: Date;

  @AllowNull
  @Column(DataType.DATE)
  deactivatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @AllowNull
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  deletedBy: string;
}
