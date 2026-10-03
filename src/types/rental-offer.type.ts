import { TCity } from './city.type.js';
import { THousingType } from './housing-type.type.js';
import { TConvenience } from './convenience.type.js';
import { TUser } from './user.type.js';
import { TLocation } from './location.type.js';

export type TRentalOffer = {
  title: string;
  description: string;
  publishDate: Date;
  city: TCity;
  previewUrl: string;
  photoUrls: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: THousingType;
  roomsCount: number;
  guestsCount: number;
  price: number
  conveniences: TConvenience[];
  author: TUser;
  commentsCount: number;
  location: TLocation;
}
