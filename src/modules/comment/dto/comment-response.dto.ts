import { CommentDocument } from '../comment.entity.js';
import { isPopulatedUser } from '../../../shared/utils/index.js';

export type CommentResponseDto = {
  id: string;
  text: string;
  rating: number;
  publishDate: Date;
  author: {
    id: string;
    name: string;
    email: string;
    avatarPath: string;
    userType: string;
  };
};

export function mapCommentToResponse(comment: CommentDocument): CommentResponseDto {
  const author = comment.author;

  if (!isPopulatedUser(author)) {
    throw new Error(`Author for comment ${comment._id.toString()} is not populated`);
  }

  return {
    id: comment._id.toString(),
    text: comment.text,
    rating: comment.rating,
    publishDate: comment.publishDate,
    author: {
      id: author._id.toString(),
      name: author.name,
      email: author.email,
      avatarPath: author.photoUrl,
      userType: author.type,
    },
  };
}
