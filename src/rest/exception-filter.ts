import { Request, Response, NextFunction } from 'express';
import { ILogger } from '../shared/logging/index.js';
import { HttpError } from '../shared/errors/index.js';
import { StatusCodes } from 'http-status-codes';
import { Component } from '../types/index.js';
import { inject, injectable } from 'inversify';

@injectable()
export class ExceptionFilter {
  constructor(
    @inject(Component.ILogger) private readonly logger: ILogger
  ) {
  }

  public catch(err: Error, req: Request, res: Response, _next: NextFunction): void {
    if (err instanceof HttpError) {
      this.logger.error(`[${req.method}] ${req.url} - ${err.statusCode} - ${err.message}`, err);
      res.status(err.statusCode).json({ error: err.message });
      return;
    }

    this.logger.error(`[${req.method}] ${req.url} - 500 - ${err.message}`, err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
}
