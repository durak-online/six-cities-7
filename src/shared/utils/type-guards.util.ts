import { Types } from 'mongoose';
import { UserDocument } from '../../modules/user/index.js';

export function isOneOf<T extends string>(
  list: readonly T[],
  value: string,
): value is T {
  return (list as readonly string[]).includes(value);
}

export function isPopulatedUser(user: Types.ObjectId | UserDocument): user is UserDocument {
  return typeof user === 'object' && user !== null && 'email' in user;
}
