import { TUser } from './user.type.js';

export type TMockServerData = {
  titles: string[];
  descriptions: string[];
  previewUrls: string[];
  photoUrls: string[];
  users: TUser[];
};
