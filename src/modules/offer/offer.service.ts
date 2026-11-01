import { inject, injectable } from 'inversify';
import { Model, Types } from 'mongoose';
import { IOfferService } from './offer-service.interface.js';
import { RentalOfferDocument } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../shared/logging/index.js';
import { CommentDocument } from '../comment/index.js';

@injectable()
export class DefaultOfferService implements IOfferService {
  constructor(
    @inject(Component.ILogger) private readonly logger: ILogger,
    @inject(Component.OfferModel) private readonly offerModel: Model<RentalOfferDocument>,
    @inject(Component.CommentModel) private readonly commentModel: Model<CommentDocument>
  ) {
  }

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

  public async deleteById(id: string): Promise<void> {
    await this.commentModel.deleteMany({ offerId: new Types.ObjectId(id) });
    await this.offerModel.findByIdAndDelete(id).exec();
    this.logger.info(`Offer and its comments deleted: ${id}`);
  }

  public async updateRatingAndCommentsCount(offerId: string): Promise<void> {
    const comments = await this.commentModel.find({ offerId: new Types.ObjectId(offerId) });
    const commentsCount = comments.length;

    const averageRating = commentsCount > 0
      ? comments.reduce((sum, comment) => sum + comment.rating, 0) / commentsCount
      : 1;

    await this.offerModel.findByIdAndUpdate(offerId, {
      commentsCount,
      rating: Number(averageRating.toFixed(1)),
    }).exec();
  }
}
