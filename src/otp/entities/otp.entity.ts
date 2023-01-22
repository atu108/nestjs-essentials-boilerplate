import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  DeletedAt,
  AllowNull,
  ForeignKey,
  Default,
} from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';

@Table
export class Otp extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @AllowNull
  @Column(DataType.STRING)
  mobile: string;

  @Column(DataType.STRING)
  code: string;

  @Column(DataType.STRING)
  purpose: string;

  @Column(DataType.DATE)
  validTill: Date;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isVerified: boolean;

  @Default(0)
  @Column(DataType.INTEGER)
  attempt: number;

  @Column(DataType.UUID)
  userId: string;

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
