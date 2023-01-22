export const JWT_SECRET = process.env.JWT_PRIVATE_KEY;

export enum ACCESS_TYPE {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  AM = 'AM',
  TL = 'TL',
  FSE = 'FSE',
  AUDITOR = 'AUDITOR',
}

export const USER_ROLES_LEVEL = {
  [ACCESS_TYPE.ADMIN]: 1,
  [ACCESS_TYPE.MANAGER]: 2,
  [ACCESS_TYPE.AM]: 3,
  [ACCESS_TYPE.AUDITOR]: 4,
  [ACCESS_TYPE.TL]: 5,
  [ACCESS_TYPE.FSE]: 6,
};

export const SELF_REGISTRATION_ALLOWED_ROLES = [
  ACCESS_TYPE.FSE,
  ACCESS_TYPE.TL,
];

export const ACCESS_TYPE_LIST = Object.keys(ACCESS_TYPE);

export enum STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
  DRAFT = 'DRAFT',
}

export const STATUS_LIST = Object.keys(STATUS);

export enum SIZE {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export const SIZE_LIST = Object.keys(SIZE);

export enum DOC_TYPE {
  PASSBOOK = 'PASSBOOK',
  CANCELLED_CHECK = 'CANCELLED_CHECK',
}

export const DOC_LIST = Object.keys(DOC_TYPE);

export enum QUALIFICATIONS {
  NO_FORMAL_EDUCATION = 'NO_FORMAL_EDUCATION',
  PRIMARY_EDUCATION = 'PRIMARY_EDUCATION',
  SECONDARY_EDUCATION = 'SECONDARY_EDUCATION',
  BACHELORS = 'BACHELORS',
  MASTERS = 'MASTERS',
  DOCTORATE = 'DOCTORATE',
}

export const QUALIFICATIONS_LIST = Object.keys(QUALIFICATIONS);

export enum GENDERS {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export const GENDERS_LIST = Object.keys(GENDERS);

export enum ADDRESS_TYPES {
  WORK = 'WORK',
  PERMANENT = 'PERMANENT',
  PRESENT = 'PRESENT',
}

export const ADDRESS_TYPES_LIST = Object.keys(ADDRESS_TYPES);

export enum KYC {
  AADHAR_CARD = 'AADHAR_CARD',
  PAN_CARD = 'PAN_CARD',
  RENT_AGREEMENT = 'RENT_AGREEMENT',
  VOTER_ID = 'VOTER_ID',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  OTHER = 'OTHER',
}

export const ATTACHMENT_TYPE = {
  KYC: KYC,
  PROFILE_PIC: 'PROFILE_PIC',
};

export const KYC_DOCUMENTS = KYC;

export const KYC_DOCUMENT_LIST = Object.keys(KYC);

export const ATTACHMENT_TYPE_LIST = [
  ...KYC_DOCUMENT_LIST,
  ...Object.keys(ATTACHMENT_TYPE.PROFILE_PIC),
];

export enum EMPLOYEMNT_INACTIVE_RESONS {
  RESIGNED = 'RESIGNED',
  TERMINATED = 'TERMINATED',
  ABSCONDING = 'ABSCONDING',
  RETIRED = 'RETIRED',
  CONTRACT_COMPLETED = 'CONTRACT_COMPLETED',
}

export const EMPLOYEMNT_INACTIVE_RESONS_LIST = Object.keys(
  EMPLOYEMNT_INACTIVE_RESONS,
);

export enum KYC_STATUS {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUBMITTED = 'SUBMITTED',
}

export const KYC_STATUS_LIST = Object.keys(KYC_STATUS);

export enum ATTENDANCE_STATUS {
  MARKED = 'MARKED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
export const ATTENDANCE_STATUS_LIST = Object.keys(ATTENDANCE_STATUS);

export enum KYC_STEP_NAMES {
  PROFILE_PIC = 'PROFILE_PIC',
  AADHAR_CARD = 'AADHAR_CARD',
  PAN_CARD = 'PAN_CARD',
  WORK_ADDRESS = 'WORK_ADDRESS',
  PRESENT_ADDRESS = 'PRESENT_ADDRESS',
  PERMANENT_ADDRESS = 'PERMANENT_ADDRESS',
  BANK_DETAILS = 'BANK_DETAILS',
}

export const KYC_STEPS = {
  [ACCESS_TYPE.FSE]: {
    [KYC_STEP_NAMES.PROFILE_PIC]: {
      stepName: KYC_STEP_NAMES.PROFILE_PIC,
      order: 1,
      isApprovalRequired: true,
    },
    [KYC_STEP_NAMES.AADHAR_CARD]: {
      stepName: KYC_STEP_NAMES.AADHAR_CARD,
      order: 2,
      isApprovalRequired: true,
    },
    [KYC_STEP_NAMES.PAN_CARD]: {
      stepName: KYC_STEP_NAMES.PAN_CARD,
      order: 3,
      isApprovalRequired: true,
    },
    [KYC_STEP_NAMES.WORK_ADDRESS]: {
      stepName: KYC_STEP_NAMES.WORK_ADDRESS,
      order: 4,
      isApprovalRequired: true,
    },
    [KYC_STEP_NAMES.PRESENT_ADDRESS]: {
      stepName: KYC_STEP_NAMES.PRESENT_ADDRESS,
      order: 5,
      isApprovalRequired: true,
    },
    [KYC_STEP_NAMES.BANK_DETAILS]: {
      stepName: KYC_STEP_NAMES.BANK_DETAILS,
      order: 6,
      isApprovalRequired: true,
    },
  },
  [ACCESS_TYPE.TL]: {
    [KYC_STEP_NAMES.PROFILE_PIC]: {
      stepName: KYC_STEP_NAMES.PROFILE_PIC,
      order: 1,
      isApprovalRequired: true,
    },
    [KYC_STEP_NAMES.AADHAR_CARD]: {
      stepName: KYC_STEP_NAMES.AADHAR_CARD,
      order: 2,
      isApprovalRequired: true,
    },
    [KYC_STEP_NAMES.PAN_CARD]: {
      stepName: KYC_STEP_NAMES.PAN_CARD,
      order: 3,
      isApprovalRequired: true,
    },
    [KYC_STEP_NAMES.WORK_ADDRESS]: {
      stepName: KYC_STEP_NAMES.WORK_ADDRESS,
      order: 4,
      isApprovalRequired: true,
    },
    [KYC_STEP_NAMES.PRESENT_ADDRESS]: {
      stepName: KYC_STEP_NAMES.PRESENT_ADDRESS,
      order: 5,
      isApprovalRequired: true,
    },
    [KYC_STEP_NAMES.BANK_DETAILS]: {
      stepName: KYC_STEP_NAMES.BANK_DETAILS,
      order: 6,
      isApprovalRequired: true,
    },
  },
};
