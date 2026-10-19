import { Schema, model, Document } from 'mongoose';
import { USER_TYPES } from '../../constants/index.js';
import { TUser } from '../../types/index.js';
import { createSHA256 } from '../../shared/utils/index.js';

export interface UserDocument extends TUser, Document {
  createdAt: Date;
  updatedAt: Date;

  setPassword(password: string, salt: string): void;
  getPassword(): string;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'] },
    photoUrl: { type: String },
    password: { type: String, required: true },
    type: { type: String, required: true, enum: [...USER_TYPES] },
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

userSchema.methods.setPassword = function (this: UserDocument, password: string, salt: string): void {
  this.password = createSHA256(password, salt);
};

userSchema.methods.getPassword = function (this: UserDocument): string {
  return this.password;
};

export const UserModel = model<UserDocument>('User', userSchema);
