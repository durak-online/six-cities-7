import { RentalOfferDocument } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { TCity } from '../../types/index.js';

export interface IOfferService {
  create(dto: CreateOfferDto, authorId: string): Promise<RentalOfferDocument>;
  findById(id: string): Promise<RentalOfferDocument | null>;
  deleteById(id: string): Promise<void>;
  updateRatingAndCommentsCount(offerId: string): Promise<void>;
  updateById(id: string, dto: UpdateOfferDto, userId: string): Promise<RentalOfferDocument | null>;
  findAll(limit?: number): Promise<RentalOfferDocument[]>;
  findPremiumByCity(city: TCity): Promise<RentalOfferDocument[]>;
  findFavorites(): Promise<RentalOfferDocument[]>;
  toggleFavorite(id: string): Promise<RentalOfferDocument | null>;
}
