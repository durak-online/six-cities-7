import { Schema, model, Document } from 'mongoose';
import { USER_TYPES } from '../../constants/index.js';
import { TUser } from '../../types/index.js';

export interface UserDocument extends TUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    photoUrl: { type: String },
    password: { type: String, required: true },
    type: { type: String, required: true, enum: [...USER_TYPES] },
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

export const UserModel = model<UserDocument>('User', userSchema);
