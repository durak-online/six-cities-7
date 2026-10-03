import { isOneOf } from '../shared/utils/index.js';
import { HOUSING_TYPES } from '../constants/index.js';

export type THousingType = (typeof HOUSING_TYPES)[number];

export function asHousingType(value: string): THousingType {
  if (isOneOf(HOUSING_TYPES, value)) {
    return value as THousingType;
  }
  throw new Error(`Invalid housing type: "${value}"`);
}
