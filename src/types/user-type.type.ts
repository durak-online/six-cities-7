import { USER_TYPES } from '../constants/index.js';

export type UserType = (typeof USER_TYPES)[number];

export function asUserType(value: string): UserType {
  if (Object.hasOwn(USER_TYPES, value)) {
    return value as UserType;
  }

  throw new Error(`Invalid user type: "${value}"`);
}
