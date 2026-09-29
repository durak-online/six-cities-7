import { UserType } from './user-type.type.js';

export type User = {
  name: string;
  email: string;
  photoUrl: string;
  password: string;
  type: UserType;
}
