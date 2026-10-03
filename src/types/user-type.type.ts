import { USER_TYPES } from '../constants/index.js';
import { isOneOf } from '../shared/utils/index.js';

export type TUserType = (typeof USER_TYPES)[number];

export function asUserType(value: string): TUserType {
  if (isOneOf(USER_TYPES, value)) {
    return value as TUserType;
  }

  throw new Error(`Invalid user type: "${value}"`);
}
