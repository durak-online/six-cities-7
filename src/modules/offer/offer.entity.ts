import { Schema, model, Document, Types } from 'mongoose';
import { TRentalOffer } from '../../types/index.js';
import { CITY_LOCATIONS, CONVENIENCES, HOUSING_TYPES } from '../../constants/index.js';

export interface RentalOfferDocument extends Omit<TRentalOffer, 'author'>, Document {
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const offerSchema = new Schema<RentalOfferDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    publishDate: { type: Date, required: true },
    city: { type: String, required: true, enum: Object.keys(CITY_LOCATIONS) },
    previewUrl: { type: String, required: true },
    photoUrls: { type: [String], required: true },
    isPremium: { type: Boolean, required: true },
    isFavorite: { type: Boolean, required: true },
    rating: { type: Number, required: true },
    housingType: { type: String, required: true, enum: [...HOUSING_TYPES] },
    roomsCount: { type: Number, required: true },
    guestsCount: { type: Number, required: true },
    price: { type: Number, required: true },
    conveniences: { type: [String], required: true, enum: [...CONVENIENCES] },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    commentsCount: { type: Number, default: 0 },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  {
    timestamps: true,
    collection: 'rental_offers'
  }
);

export const RentalOfferModel = model<RentalOfferDocument>('RentalOffer', offerSchema);
