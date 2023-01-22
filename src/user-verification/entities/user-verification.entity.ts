import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';

@Table
export class UserVerification extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isMobileVerified: boolean;

  @Default(false)
  @AllowNull
  @Column(DataType.BOOLEAN)
  isEmailVerified: boolean;

  @Default(false)
  @AllowNull
  @Column(DataType.BOOLEAN)
  isKycVerified: boolean;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;

  @BelongsTo(() => User, 'userId')
  user: User;
}
