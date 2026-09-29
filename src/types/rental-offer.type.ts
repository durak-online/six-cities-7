import { City } from './city.type.js';
import { HousingType } from './housing-type.type.js';
import { Convenience } from './convenience.type.js';
import { User } from './user.type.js';
import { Location } from './location.type.js';

export type RentalOffer = {
  title: string;
  description: string;
  publishDate: Date;
  city: City;
  previewUrl: string;
  photoUrls: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: HousingType;
  roomsCount: number;
  guestsCount: number;
  price: number
  conveniences: Convenience[];
  author: User;
  commentsCount: number;
  location: Location;
}
