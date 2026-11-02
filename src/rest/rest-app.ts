import { ILogger } from '../shared/logging/index.js';
import { IConfig, RestSchema } from '../config/index.js';
import { inject, injectable, multiInject } from 'inversify';
import { Component } from '../types/index.js';
import { IDatabaseClient } from '../shared/database/index.js';
import { getMongoURI } from '../shared/utils/index.js';
import { ExceptionFilter } from './exception-filter.js';
import express, { Express } from 'express';
import { BaseController } from './controllers/index.js';

@injectable()
export class RestApp {
  private readonly expressApp: Express;

  public constructor(
    @inject(Component.ILogger) private readonly logger: ILogger,
    @inject(Component.IConfig) private readonly config: IConfig<RestSchema>,
    @inject(Component.IDatabaseClient) private readonly dbClient: IDatabaseClient,
    @inject(Component.ExceptionFilter) private readonly exceptionFilter: ExceptionFilter,
    @multiInject(Component.Controller) private readonly controllers: BaseController[],
  ) {
    this.logger = logger.child(this.constructor.name);
    this.expressApp = express();
  }

  public async init() {
    const port = this.config.get('PORT');
    this.logger.info(`Config port: ${port}`);

    await this.initDB();
    this.registerMiddlewares();
    this.registerRoutes();
    this.registerExceptionFilter();

    this.expressApp.listen(port, () => {
      this.logger.info(`Server started on http://localhost:${port}`);
    });
    this.logger.info('App initialized');
  }

  private async initDB() {
    const uri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    return await this.dbClient.connect(uri);
  }

  private registerMiddlewares(): void {
    this.expressApp.use(express.json());
    this.logger.info('Middlewares registered');
  }

  private registerRoutes(): void {
    for (const controller of this.controllers) {
      this.logger.info(`Registering routes for path: ${controller.path}`);
      this.expressApp.use(controller.path, controller.getRouter());
    }
  }

  private registerExceptionFilter(): void {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    this.logger.info('Exception filter registered');
  }
}
