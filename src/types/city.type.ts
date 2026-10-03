import { CITY_LOCATIONS } from '../constants/index.js';

export type City = keyof typeof CITY_LOCATIONS;

export function asCity(value: string): City {
  if (Object.hasOwn(CITY_LOCATIONS, value)) {
    return value as City;
  }

  throw new Error(`Invalid city: "${value}"`);
}
