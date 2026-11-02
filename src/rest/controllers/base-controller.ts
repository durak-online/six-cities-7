import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

export abstract class BaseController {
  public abstract readonly path: string;

  protected ok<T>(res: Response, data: T): void {
    res.status(StatusCodes.OK).json(data);
  }

  protected created<T>(res: Response, data: T): void {
    res.status(StatusCodes.CREATED).json(data);
  }

  protected noContent(res: Response): void {
    res.status(StatusCodes.NO_CONTENT).send();
  }

  public abstract getRouter(): Router;
}
