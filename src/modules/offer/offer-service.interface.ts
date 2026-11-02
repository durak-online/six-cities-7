import { RentalOfferDocument } from './offer.entity.js';
import { CreateOfferDto, UpdateOfferDto } from './dto/index.js';
import { TCity } from '../../types/index.js';

export interface IOfferService {
  create(dto: CreateOfferDto, authorId: string): Promise<RentalOfferDocument>;
  findById(id: string): Promise<RentalOfferDocument>;
  deleteById(id: string, userId: string): Promise<void>;
  updateRatingAndCommentsCount(offerId: string): Promise<void>;
  updateById(id: string, dto: UpdateOfferDto, userId: string): Promise<RentalOfferDocument>;
  findAll(limit?: number): Promise<RentalOfferDocument[]>;
  findPremiumByCity(city: TCity): Promise<RentalOfferDocument[]>;
  findFavorites(): Promise<RentalOfferDocument[]>;
  setFavorite(id: string, state: boolean): Promise<RentalOfferDocument>;
}
