import { inject, injectable } from 'inversify';
import { Model, Types } from 'mongoose';
import { ICommentService } from './comment-service.interface.js';
import { CommentDocument } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../shared/logging/index.js';
import { IOfferService } from '../offer/index.js';

@injectable()
export class CommentService implements ICommentService {
  constructor(
    @inject(Component.ILogger) private readonly logger: ILogger,
    @inject(Component.CommentModel) private readonly commentModel: Model<CommentDocument>,
    @inject(Component.IOfferService) private readonly offerService: IOfferService,
  ) {
  }

  public async create(dto: CreateCommentDto, offerId: string, authorId: string): Promise<CommentDocument> {
    const commentData = {
      ...dto,
      offerId: new Types.ObjectId(offerId),
      author: new Types.ObjectId(authorId),
      publishDate: new Date(),
    };

    const result = await this.commentModel.create(commentData);
    this.logger.info(`Comment created for offer: ${offerId}`);

    await this.offerService.updateRatingAndCommentsCount(offerId);

    return result;
  }

  public async findByOfferId(offerId: string): Promise<CommentDocument[]> {
    return this.commentModel
      .find({ offerId: new Types.ObjectId(offerId) })
      .sort({ publishDate: -1 })
      .limit(50)
      .populate('author')
      .exec();
  }
}
