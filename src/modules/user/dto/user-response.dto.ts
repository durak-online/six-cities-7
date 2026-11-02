import { UserDocument } from '../user.entity.js';

export type UserResponseDto = {
  id: string;
  name: string;
  email: string;
  avatarPath: string;
  userType: string;
};

export function mapUserToResponse(user: UserDocument): UserResponseDto {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatarPath: user.photoUrl || '/img/avatars/default.png',
    userType: user.type,
  };
}
