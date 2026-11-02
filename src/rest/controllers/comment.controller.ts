import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { inject, injectable } from 'inversify';
import { plainToInstance } from 'class-transformer';
import { BaseController } from './base-controller.js';
import { Component } from '../../types/index.js';
import { ICommentService, CreateCommentDto } from '../../modules/comment/index.js';
import { mapCommentToResponse } from '../../modules/comment/dto/comment-response.dto.js';

@injectable()
export class CommentController extends BaseController {
  public override readonly path = '/offers/:offerId/comments';

  constructor(
    @inject(Component.ICommentService) private readonly commentService: ICommentService
  ) {
    super();
  }

  public override getRouter(): Router {
    const router = Router({ mergeParams: true });

    router.get('/', asyncHandler(this.getMany.bind(this)));
    router.post('/', asyncHandler(this.create.bind(this)));

    return router;
  }

  private async getMany(
    req: Request<{ offerId: string }>,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.findByOfferId(req.params.offerId);
    const responseData = comments.map(mapCommentToResponse);
    this.ok(res, responseData);
  }

  private async create(
    req: Request<{ offerId: string }, unknown, CreateCommentDto>,
    res: Response
  ): Promise<void> {
    const dto = plainToInstance(CreateCommentDto, req.body);

    // Заглушка для ID автора, пока нет JWT
    const mockAuthorId = '507f1f77bcf86cd799439011';

    const comment = await this.commentService.create(dto, req.params.offerId, mockAuthorId);
    this.created(res, mapCommentToResponse(comment));
  }
}
