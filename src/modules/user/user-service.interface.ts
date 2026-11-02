import { UserDocument } from './user.entity.js';
import { CreateUserDto } from './dto/index.js';

export interface IUserService {
  create(dto: CreateUserDto, salt: string): Promise<UserDocument>;
  findById(id: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<UserDocument>;
  verifyUser(email: string, password: string, salt: string): Promise<UserDocument>;
}
