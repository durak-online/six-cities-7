import { ContainerModule } from 'inversify';
import { Model } from 'mongoose';
import { Component } from '../../types/index.js';
import { RentalOfferModel, RentalOfferDocument } from './offer.entity.js';
import { DefaultOfferService } from './offer.service.js';
import { IOfferService } from './offer-service.interface.js';

export const offerModule = new ContainerModule((options) => {
  options.bind<Model<RentalOfferDocument>>(Component.OfferModel).toConstantValue(RentalOfferModel);
  options.bind<IOfferService>(Component.IOfferService).to(DefaultOfferService).inSingletonScope();
});
