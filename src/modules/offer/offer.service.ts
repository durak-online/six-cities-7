import { inject, injectable } from 'inversify';
import { Model, Types } from 'mongoose';
import { IOfferService } from './offer-service.interface.js';
import { RentalOfferDocument } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../shared/logging/index.js';

@injectable()
export class DefaultOfferService implements IOfferService {
  constructor(
    @inject(Component.ILogger) private readonly logger: ILogger,
    @inject(Component.OfferModel) private readonly offerModel: Model<RentalOfferDocument>
  ) {}

  public async create(dto: CreateOfferDto, authorId: string): Promise<RentalOfferDocument> {
    const offerData = {
      ...dto,
      author: new Types.ObjectId(authorId),
      publishDate: new Date(),
      isFavorite: false,
      commentsCount: 0,
      rating: 1, // рейтинг по умолчанию для нового предложения? (странно ставить какой-то рейтинг без отзывов, но по ТЗ рейтинг обязателен)
    };

    const result = await this.offerModel.create(offerData);
    this.logger.info(`New offer created: ${result.title} (${result.city})`);

    return result;
  }

  public async findById(id: string): Promise<RentalOfferDocument | null> {
    return this.offerModel.findById(id).populate('author').exec();
  }
}
