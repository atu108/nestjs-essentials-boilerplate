import { File } from '../files/entities/file.entity';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../user-role/entities/user-role.entity';
import { State } from '../state/entities/state.entity';
import { PinCode } from '../pin-code/entities/pin-code.entity';
import { Country } from '../country/entities/country.entity';
import { City } from '../city/entities/city.entity';
import { Attachment } from '../files/entities/attachment.entity';
import { Otp } from '../otp/entities/otp.entity';
import { UserVerification } from '../user-verification/entities/user-verification.entity';
export const models = [
  User,
  UserRole,
  Country,
  State,
  City,
  PinCode,
  Attachment,
  File,
  Otp,
  UserVerification
];
