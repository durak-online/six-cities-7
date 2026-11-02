import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { inject, injectable } from 'inversify';
import { plainToInstance } from 'class-transformer';
import { BaseController } from './base-controller.js';
import { Component } from '../../types/index.js';
import { IUserService, LoginUserDto } from '../../modules/user/index.js';
import { IConfig, RestSchema } from '../../config/index.js';
import { CreateUserDto, mapUserToResponse } from '../../modules/user/index.js';
import { UnauthorizedError } from '../../shared/errors/index.js';

@injectable()
export class UserController extends BaseController {
  public override readonly path = '/users';

  constructor(
    @inject(Component.IUserService) private readonly userService: IUserService,
    @inject(Component.IConfig) private readonly config: IConfig<RestSchema>,
  ) {
    super();
  }

  public override getRouter(): Router {
    const router = Router();

    router.post('/', asyncHandler(this.register.bind(this)));
    router.post('/login', asyncHandler(this.login.bind(this)));
    router.get('/me', asyncHandler(this.getMe.bind(this)));

    return router;
  }

  private async register(
    req: Request<unknown, unknown, CreateUserDto>,
    res: Response
  ): Promise<void> {
    const dto = plainToInstance(CreateUserDto, req.body);
    const salt = this.config.get('SALT');

    const user = await this.userService.create(dto, salt);
    this.created(res, mapUserToResponse(user));
  }

  private async login(
    req: Request<unknown, unknown, LoginUserDto>,
    res: Response
  ): Promise<void> {
    const dto = plainToInstance(LoginUserDto, req.body);
    const salt = this.config.get('SALT');

    const user = await this.userService.verifyUser(dto.email, dto.password, salt);

    // TODO генерировать JWT токен
    const mockToken = 'mock-jwt-token';

    this.ok(res, { token: mockToken });
  }

  private async getMe(
    _req: Request,
    res: Response
  ): Promise<void> {
    // пока нет JWT
    const mockUserId = '507f1f77bcf86cd799439011';

    const user = await this.userService.findById(mockUserId);

    if (!user) {
      throw new UnauthorizedError();
    }

    this.ok(res, mapUserToResponse(user));
  }
}
