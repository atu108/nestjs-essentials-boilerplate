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
import { STATUS, STATUS_LIST } from '../../common/constants/user.constant';
import { State } from '../../state/entities/state.entity';
import { User } from '../../user/entities/user.entity';
@DefaultScope(() => ({
  include: [{ model: State, attributes: ['id', 'name'] }],
}))
@Table
export class City extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Unique
  @Column(DataType.STRING)
  name: string;

  @ForeignKey(() => State)
  @Column(DataType.UUID)
  stateId: string;

  @BelongsTo(() => State, 'stateId')
  state: State;

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
