import { UserDocument } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';

export interface IUserService {
  create(dto: CreateUserDto, salt: string): Promise<UserDocument>;
  findById(id: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
}
