import { IFileReader } from './file-reader.interface.js';
import {
  RentalOffer,
  Convenience,
  Location,
  asCity,
  asConvenience,
  asHousingType,
} from '../../types/index.js';
import {
  asBoolean,
  asDate,
  asFloatInRange,
  asIntInRange,
  asStringInLenRange, readLines,
} from '../utils/index.js';
import {
  TITLE_LENGTH,
  DESCRIPTION_LENGTH,
  PHOTOS_COUNT,
  RATING_RANGE,
  ROOMS_COUNT_RANGE,
  GUESTS_COUNT_RANGE,
  PRICE_RANGE,
  TSV_COLUMNS_COUNT,
  TSV_LIST_SEPARATOR,
} from '../../constants/index.js';

export class TSVReader implements IFileReader<RentalOffer> {
  public async *read(path: string): AsyncGenerator<RentalOffer> {
    for await (const rawLine of readLines(path)) {
      const line = rawLine.trim();

      if (line.length === 0) {
        continue;
      }

      const offer = this.parseLine(line);

      if (offer !== null) {
        yield offer;
      }
    }
  }

  private parseLine(line: string): RentalOffer | null {
    const parts = line.split('\t');

    if (parts.length !== TSV_COLUMNS_COUNT) {
      return null;
    }

    const [
      titleRaw, descriptionRaw, publishDateRaw, cityRaw, previewUrl, photoUrlsRaw,
      isPremiumRaw, isFavoriteRaw, ratingRaw, housingTypeRaw, roomsCountRaw,
      guestsCountRaw, priceRaw, conveniencesRaw, authorEmail,
      commentsCountRaw, locationRaw,
    ] = parts;

    try {
      return {
        title: asStringInLenRange(titleRaw, TITLE_LENGTH.min, TITLE_LENGTH.max),
        description: asStringInLenRange(descriptionRaw, DESCRIPTION_LENGTH.min, DESCRIPTION_LENGTH.max),
        publishDate: asDate(publishDateRaw),
        city: asCity(cityRaw),
        previewUrl,
        photoUrls: this.parsePhotos(photoUrlsRaw),
        isPremium: asBoolean(isPremiumRaw),
        isFavorite: asBoolean(isFavoriteRaw),
        rating: asFloatInRange(ratingRaw, RATING_RANGE.min, RATING_RANGE.max),
        housingType: asHousingType(housingTypeRaw),
        roomsCount: asIntInRange(roomsCountRaw, ROOMS_COUNT_RANGE.min, ROOMS_COUNT_RANGE.max),
        guestsCount: asIntInRange(guestsCountRaw, GUESTS_COUNT_RANGE.min, GUESTS_COUNT_RANGE.max),
        price: asIntInRange(priceRaw, PRICE_RANGE.min, PRICE_RANGE.max),
        conveniences: this.parseConveniences(conveniencesRaw),
        // TODO: искать реального юзера вместо заглушки
        author: {
          email: authorEmail,
          name: 'John Doe',
          type: 'common',
          password: 'qwerty123',
          photoUrl: '/userphotos/1',
        },
        commentsCount: asIntInRange(commentsCountRaw, 0, Number.MAX_SAFE_INTEGER),
        location: this.parseLocation(locationRaw),
      };
    } catch {
      return null;
    }
  }

  private parsePhotos(raw: string): string[] {
    const photos = raw.split(TSV_LIST_SEPARATOR).map((photo) => photo.trim());

    if (photos.length !== PHOTOS_COUNT) {
      throw new Error(`Expected ${PHOTOS_COUNT} photos, got ${photos.length}`);
    }

    return photos;
  }

  private parseConveniences(raw: string): Convenience[] {
    return raw
      .split(TSV_LIST_SEPARATOR)
      .map((item) => asConvenience(item.trim()));
  }

  private parseLocation(raw: string): Location {
    const [latitudeRaw, longitudeRaw] = raw.split(TSV_LIST_SEPARATOR);

    if (!latitudeRaw || !longitudeRaw) {
      throw new Error(`Invalid location format: "${raw}"`);
    }

    const latitude = Number.parseFloat(latitudeRaw);
    const longitude = Number.parseFloat(longitudeRaw);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      throw new Error(`Invalid coordinates: "${raw}"`);
    }

    return { latitude, longitude };
  }
}
