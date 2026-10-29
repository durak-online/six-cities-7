import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';
import { IUserService } from './user-service.interface.js';
import { UserDocument } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { asUserType, Component } from '../../types/index.js';
import { ILogger } from '../../shared/logging/index.js';
import { createSHA256 } from '../../shared/utils/index.js';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(Component.ILogger) private readonly logger: ILogger,
    @inject(Component.UserModel) private readonly userModel: Model<UserDocument>
  ) {
  }

  public async create(dto: CreateUserDto, salt: string): Promise<UserDocument> {
    const userData = {
      name: dto.name,
      email: dto.email,
      photoUrl: dto.photoUrl,
      password: createSHA256(dto.password, salt),
      type: asUserType(dto.userType),
    };

    const result = await this.userModel.create(userData);
    this.logger.info(`New user created: ${result.email}`);

    return result;
  }

  public async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<UserDocument> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }
}
