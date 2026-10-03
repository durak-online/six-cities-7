import { CITY_LOCATIONS } from '../constants/index.js';

export type TCity = keyof typeof CITY_LOCATIONS;

export function asCity(value: string): TCity {
  if (Object.hasOwn(CITY_LOCATIONS, value)) {
    return value as TCity;
  }

  throw new Error(`Invalid city: "${value}"`);
}
