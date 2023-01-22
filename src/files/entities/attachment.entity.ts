import {
  Column,
  Model,
  Table,
  DataType,
  Default,
  ForeignKey,
  AllowNull,
  BelongsTo,
  CreatedAt,
  DeletedAt,
  PrimaryKey,
} from 'sequelize-typescript';
import { File } from './file.entity';
import { ATTACHMENT_TYPE_LIST } from '../../common/constants/user.constant';
import { User } from '../../user/entities/user.entity';

@Table
export class Attachment extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.ENUM({
      values: ATTACHMENT_TYPE_LIST,
    }),
  })
  type: string;

  @ForeignKey(() => File)
  @Column(DataType.UUID)
  fileId: string;

  @Column(DataType.UUID)
  referenceId: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  deleted: boolean;

  @CreatedAt
  createdAt: Date;

  @AllowNull
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  createdBy: string;

  @DeletedAt
  deletedAt: Date;

  @AllowNull
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  deletedBy: string;

  @BelongsTo(() => File)
  file: File;
}

