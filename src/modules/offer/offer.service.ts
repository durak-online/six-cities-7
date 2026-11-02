import { inject, injectable } from 'inversify';
import { Model, Types } from 'mongoose';
import { IOfferService } from './offer-service.interface.js';
import { RentalOfferDocument } from './offer.entity.js';
import { CreateOfferDto, UpdateOfferDto } from './dto/index.js';
import { Component, TCity } from '../../types/index.js';
import { ILogger } from '../../shared/logging/index.js';
import { CommentDocument } from '../comment/index.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../shared/errors/index.js';

@injectable()
export class OfferService implements IOfferService {
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
    await result.populate('author');
    this.logger.info(`New offer created: ${result.title} (${result.city})`);

    return result;
  }

  public async findById(id: string): Promise<RentalOfferDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError(`Offer id ${id} is not valid`);
    }

    const offer = await this.offerModel.findById(id).populate('author').exec();

    if (!offer) {
      throw new NotFoundError(`Offer with id ${id} not found`);
    }

    return offer;
  }

  public async deleteById(id: string, userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError(`Offer id ${id} is not valid`);
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestError(`User id ${userId} is not valid`);
    }

    const offer = await this.offerModel.findById(id);

    if (!offer) {
      throw new NotFoundError(`Offer with id ${id} not found`);
    }

    if (offer.author.toString() !== userId) {
      throw new ForbiddenError('You do not have permission to delete this offer');
    }

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

  public async updateById(id: string, dto: UpdateOfferDto, userId: string): Promise<RentalOfferDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError(`Offer id ${id} is not valid`);
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestError(`User id ${userId} is not valid`);
    }

    const offer = await this.offerModel.findById(id);

    if (!offer) {
      throw new NotFoundError(`Offer with id ${id} not found`);
    }

    const authorId = offer.author instanceof Types.ObjectId
      ? offer.author.toString()
      : offer.author._id.toString();

    if (authorId !== userId) {
      throw new ForbiddenError('You do not have permission to edit this offer');
    }

    const updatedOffer = await this.offerModel
      .findByIdAndUpdate(id, dto, { returnDocument: 'after' })
      .populate('author')
      .exec();

    if (!updatedOffer) {
      throw new NotFoundError(`Offer with id ${id} not found`);
    }

    return updatedOffer;
  }

  public async findAll(limit = 60): Promise<RentalOfferDocument[]> {
    return this.offerModel
      .find()
      .sort({ publishDate: -1 })
      .limit(limit)
      .populate('author')
      .exec();
  }

  public async findPremiumByCity(city: TCity): Promise<RentalOfferDocument[]> {
    return this.offerModel
      .find({ city, isPremium: true })
      .sort({ publishDate: -1 })
      .limit(3)
      .populate('author')
      .exec();
  }

  public async findFavorites(): Promise<RentalOfferDocument[]> {
    // пока что так
    return this.offerModel.find({ isFavorite: true }).populate('author').exec();
  }

  public async setFavorite(id: string, state: boolean): Promise<RentalOfferDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError(`Offer id ${id} is not valid`);
    }

    // пока что так
    const offer = await this.offerModel
      .findByIdAndUpdate(
        id,
        { isFavorite: state },
        { returnDocument: 'after' }
      )
      .populate('author')
      .exec();

    if (!offer) {
      throw new NotFoundError(`Offer with id ${id} not found`);
    }

    return offer;
  }
}
