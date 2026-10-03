import { TUserType } from './user-type.type.js';

export type TUser = {
  name: string;
  email: string;
  photoUrl: string;
  password: string;
  type: TUserType;
}
