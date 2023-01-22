import {
  Column,
  Model,
  Table,
  DataType,
  AllowNull,
  Default,
  ForeignKey,
  DeletedAt,
  CreatedAt,
  PrimaryKey,
} from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';

@Table
export class File extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.INTEGER)
  size: number;

  @Column(DataType.STRING)
  extension: string;

  @Column(DataType.STRING)
  mimetype: string;

  @Column(DataType.INTEGER)
  width: number;

  @Column(DataType.INTEGER)
  height: number;

  @Column(DataType.STRING)
  paths: string;

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

  @Column(DataType.VIRTUAL)
  urls: any;
}
