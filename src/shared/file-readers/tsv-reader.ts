import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { RentalOffer, Convenience, City, HousingType } from '../../types/index.js';

export class TSVReader implements FileReader<RentalOffer[]> {
  public readFile(path: string): RentalOffer[] {
    const rawData = readFileSync(path, { encoding: 'utf-8' });
    return this.processRawData(rawData);
  }

  private processRawData(rawData: string): RentalOffer[] {
    return rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([title, description, publishDate, city, previewUrl, photoUrls, isPremium, isFavorite, rating, housingType, roomsCount, guestsCount, price, conveniences, author, commentsCount, location]) => ({
        title,
        description,
        publishDate: new Date(publishDate),
        city: city as City,
        previewUrl,
        photoUrls: photoUrls.split(',').map((photo) => photo.trim()),
        isPremium: isPremium.toLowerCase() === 'true',
        isFavorite: isFavorite.toLowerCase() === 'true',
        rating: Number.parseFloat(rating),
        housingType: housingType as HousingType,
        roomsCount: Number.parseInt(roomsCount, 10),
        guestsCount: Number.parseInt(guestsCount, 10),
        price: Number.parseInt(price, 10),
        conveniences: conveniences.split(',').map((convenience) => convenience.trim() as Convenience),
        // TODO искать реального юзера вместо заглушки
        author: {
          email: author,
          name: 'John Doe',
          type: 'common',
          password: 'qwerty123',
          photoUrl: '/userphotos/1',
        },
        commentsCount: Number.parseInt(commentsCount, 10),
        location: {
          latitude: Number.parseFloat(location.split(';')[0]),
          longitude: Number.parseFloat(location.split(';')[1])
        }
      }));
  }
}
