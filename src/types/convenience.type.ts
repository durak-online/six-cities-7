import { isOneOf } from '../shared/utils/index.js';
import { CONVENIENCES } from '../constants/index.js';

export type Convenience = (typeof CONVENIENCES)[number];

export function asConvenience(value: string): Convenience {
  if (isOneOf(CONVENIENCES, value)) {
    return value as Convenience;
  }
  throw new Error(`Invalid convenience: "${value}"`);
}
