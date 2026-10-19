import { ContainerModule } from 'inversify';
import { IUserService } from './user-service.interface.js';
import { Component } from '../../types/index.js';
import { UserDocument, UserModel } from './user.entity.js';
import { Model } from 'mongoose';
import { UserService } from './user.service.js';

export const userModule = new ContainerModule((options) => {
  options.bind<Model<UserDocument>>(Component.UserModel).toConstantValue(UserModel);
  options.bind<IUserService>(Component.IUserService).to(UserService).inSingletonScope();
});
