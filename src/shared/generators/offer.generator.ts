import {
  MockServerData,
  City,
  Convenience,
  asUserType,
  asHousingType,
} from '../../types/index.js';
import {
  CITY_LOCATIONS,
  HOUSING_TYPES,
  CONVENIENCES,
  TITLE_LENGTH,
  DESCRIPTION_LENGTH,
  PHOTOS_COUNT,
  RATING_RANGE,
  ROOMS_COUNT_RANGE,
  GUESTS_COUNT_RANGE,
  PRICE_RANGE,
} from '../../constants/index.js';
import {
  pickRandom,
  pickRandomManyUnique,
  randomInt,
  randomFloat,
  randomBoolean,
  randomDateInLastMonth,
} from '../utils/index.js';
import { IGenerator } from './generator.interface.js';

export class OfferGenerator implements IGenerator {
  private readonly cities: City[] = Object.keys(CITY_LOCATIONS) as City[];

  constructor(private readonly data: MockServerData) {
  }

  public generate<RentalOffer>(): RentalOffer {
    const city = pickRandom(this.cities);
    const author = pickRandom(this.data.users);

    return {
      title: this.pickTextInRange(this.data.titles, TITLE_LENGTH),
      description: this.pickTextInRange(this.data.descriptions, DESCRIPTION_LENGTH),
      publishDate: randomDateInLastMonth(),
      city,
      previewUrl: pickRandom(this.data.previewUrls),
      photoUrls: pickRandomManyUnique(this.data.photoUrls, PHOTOS_COUNT),
      isPremium: randomBoolean(),
      isFavorite: randomBoolean(),
      rating: randomFloat(RATING_RANGE.min, RATING_RANGE.max, 1),
      housingType: asHousingType(pickRandom(HOUSING_TYPES)),
      roomsCount: randomInt(ROOMS_COUNT_RANGE.min, ROOMS_COUNT_RANGE.max),
      guestsCount: randomInt(GUESTS_COUNT_RANGE.min, GUESTS_COUNT_RANGE.max),
      price: randomInt(PRICE_RANGE.min, PRICE_RANGE.max),
      conveniences: pickRandomManyUnique(
        CONVENIENCES,
        randomInt(1, CONVENIENCES.length),
      ) as Convenience[],
      author: {
        ...author,
        type: asUserType(author.type),
      },
      commentsCount: 0,
      location: CITY_LOCATIONS[city],
    } as RentalOffer;
  }

  private pickTextInRange(
    pool: string[],
    range: { min: number; max: number },
  ): string {
    const valid = pool.filter(
      (text) => text.length >= range.min && text.length <= range.max,
    );

    if (valid.length === 0) {
      throw new Error(
        `No valid text in pool for range ${range.min}..${range.max}`,
      );
    }

    return pickRandom(valid);
  }
}
