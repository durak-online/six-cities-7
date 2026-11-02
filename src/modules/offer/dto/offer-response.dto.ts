import { RentalOfferDocument } from '../offer.entity.js';
import { isPopulatedUser } from '../../../shared/utils/index.js';

export type OfferResponseDto = {
  id: string;
  title: string;
  description: string;
  publishDate: Date;
  city: string;
  previewUrl: string;
  photoUrls: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: string;
  roomsCount: number;
  guestsCount: number;
  price: number;
  conveniences: string[];
  commentsCount: number;
  location: { latitude: number; longitude: number };
  author: {
    id: string;
    name: string;
    email: string;
    avatarPath: string;
    userType: string;
  };
};

export function mapOfferToResponse(offer: RentalOfferDocument): OfferResponseDto {
  const author = offer.author;

  if (!isPopulatedUser(author)) {
    throw new Error(`Author for offer ${offer._id.toString()} is not populated`);
  }

  return {
    id: offer._id.toString(),
    title: offer.title,
    description: offer.description,
    publishDate: offer.publishDate,
    city: offer.city,
    previewUrl: offer.previewUrl,
    photoUrls: offer.photoUrls,
    isPremium: offer.isPremium,
    isFavorite: offer.isFavorite,
    rating: offer.rating,
    housingType: offer.housingType,
    roomsCount: offer.roomsCount,
    guestsCount: offer.guestsCount,
    price: offer.price,
    conveniences: offer.conveniences,
    author: {
      id: author._id.toString(),
      name: author.name,
      email: author.email,
      avatarPath: author.photoUrl,
      userType: author.type,
    },
    commentsCount: offer.commentsCount,
    location: {
      latitude: offer.location.latitude,
      longitude: offer.location.longitude,
    },
  };
}
