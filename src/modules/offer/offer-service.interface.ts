import { RentalOfferDocument } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';

export interface IOfferService {
  create(dto: CreateOfferDto, authorId: string): Promise<RentalOfferDocument>;
  findById(id: string): Promise<RentalOfferDocument | null>;
}
