import { isOneOf } from '../shared/utils/index.js';
import { CONVENIENCES } from '../constants/index.js';

export type TConvenience = (typeof CONVENIENCES)[number];

export function asConvenience(value: string): TConvenience {
  if (isOneOf(CONVENIENCES, value)) {
    return value as TConvenience;
  }
  throw new Error(`Invalid convenience: "${value}"`);
}
