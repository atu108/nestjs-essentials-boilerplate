import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  Unique,
  DeletedAt,
  IsEmail,
  AllowNull,
  ForeignKey,
  Default,
  BelongsTo,
  HasMany,
  HasOne,
  DefaultScope,
  Scopes,
} from 'sequelize-typescript';
import {
  GENDERS_LIST,
  QUALIFICATIONS_LIST,
  STATUS,
  STATUS_LIST,
} from '../../common/constants/user.constant';
import { File } from '../../files/entities/file.entity';

import { UserRole } from '../../user-role/entities/user-role.entity';
import { UserVerification } from '../../user-verification/entities/user-verification.entity';

@DefaultScope(() => ({
  attributes: { exclude: ['password'] },
  include: [{ model: UserRole, attributes: ['id', 'name', 'level'] }, File],
}))
@Table
export class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @HasOne(() => UserVerification)
  verifications: UserVerification;

  @IsEmail
  @Unique
  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  firstName: string;

  @AllowNull
  @Column(DataType.STRING)
  lastName: string;

  @Column({
    type: DataType.STRING,
  })
  password: string;

  @Unique
  @Column(DataType.STRING)
  mobile: string;

  @AllowNull
  @Column({
    type: DataType.ENUM({
      values: GENDERS_LIST,
    }),
  })
  gender: string;

  @ForeignKey(() => File)
  @Column(DataType.UUID)
  avatarId: string;

  @BelongsTo(() => File, 'avatarId')
  avatar: File;

  @AllowNull
  @Column({
    type: DataType.ENUM({
      values: QUALIFICATIONS_LIST,
    }),
  })
  highestQualification: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isVerified: boolean;

  @AllowNull
  @Column(DataType.ARRAY(DataType.STRING))
  knownLanguages: [string];

  @ForeignKey(() => UserRole)
  @Column(DataType.UUID)
  roleId: string;

  @BelongsTo(() => UserRole, 'roleId')
  role: UserRole;

  @Default(STATUS['DRAFT'])
  @Column({
    type: DataType.ENUM({
      values: STATUS_LIST,
    }),
  })
  status: string;

  @AllowNull
  @Column(DataType.UUID)
  createdBy: string;

  @AllowNull
  @Column(DataType.UUID)
  updatedBy: string;

  @Column(DataType.UUID)
  deactivatedBy: Date;

  @AllowNull
  @Column(DataType.DATE)
  deactivatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @AllowNull
  @Column(DataType.UUID)
  deletedBy: string;
}
