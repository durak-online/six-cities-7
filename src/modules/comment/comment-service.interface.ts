import { CommentDocument } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

export interface ICommentService {
  create(dto: CreateCommentDto, offerId: string, authorId: string): Promise<CommentDocument>;
  findByOfferId(offerId: string): Promise<CommentDocument[]>;
}
