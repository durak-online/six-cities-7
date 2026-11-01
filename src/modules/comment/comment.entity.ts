import { Schema, model, Document, Types } from 'mongoose';

export interface CommentDocument extends Document {
  text: string;
  rating: number;
  author: Types.ObjectId;
  offerId: Types.ObjectId;
  publishDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<CommentDocument>(
  {
    text: { type: String, required: true, minLength: 5, maxLength: 1024 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    offerId: { type: Schema.Types.ObjectId, ref: 'RentalOffer', required: true },
    publishDate: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    collection: 'comments'
  }
);

export const CommentModel = model<CommentDocument>('Comment', commentSchema);
