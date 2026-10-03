import { isOneOf } from '../shared/utils/index.js';
import { HOUSING_TYPES } from '../constants/index.js';

export type HousingType = (typeof HOUSING_TYPES)[number];

export function asHousingType(value: string): HousingType {
  if (isOneOf(HOUSING_TYPES, value)) {
    return value as HousingType;
  }
  throw new Error(`Invalid housing type: "${value}"`);
}
