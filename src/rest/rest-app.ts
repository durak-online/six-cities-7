import { ILogger } from '../shared/logging/index.js';
import { IConfig, RestSchema } from '../config/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../types/index.js';

@injectable()
export class RestApp {
  public constructor(
    @inject(Component.ILogger) private readonly logger: ILogger,
    @inject(Component.IConfig) private readonly config: IConfig<RestSchema>,
  ) {
  }

  public async init() {
    this.logger.info('App initialized');
    this.logger.info(`Config port: ${this.config.get('PORT')}`);
  }
}
