import { USER_TYPES } from '../constants/index.js';
import { isOneOf } from '../shared/utils/index.js';

export type UserType = (typeof USER_TYPES)[number];

export function asUserType(value: string): UserType {
  if (isOneOf(USER_TYPES, value)) {
    return value as UserType;
  }

  throw new Error(`Invalid user type: "${value}"`);
}
