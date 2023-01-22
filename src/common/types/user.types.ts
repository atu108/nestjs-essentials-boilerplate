export type UserInfoInToken = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  roleId: string;
  role: RoleType;
};

export type RoleType = {
  id: string;
  name: string;
  level: number;
};
