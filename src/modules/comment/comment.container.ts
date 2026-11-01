import { ContainerModule } from 'inversify';
import { Model } from 'mongoose';
import { Component } from '../../types/index.js';
import { CommentModel, CommentDocument } from './comment.entity.js';
import { CommentService } from './comment.service.js';
import { ICommentService } from './comment-service.interface.js';

export const commentModule = new ContainerModule((options) => {
  options.bind<Model<CommentDocument>>(Component.CommentModel).toConstantValue(CommentModel);
  options.bind<ICommentService>(Component.ICommentService).to(CommentService).inSingletonScope();
});
