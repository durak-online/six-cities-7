import { TUser } from './user.type.js';

export type TComment = {
  text: string;
  publishDate: Date;
  rating: number;
  author: TUser
}
