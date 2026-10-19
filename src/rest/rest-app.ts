import { ILogger } from '../shared/logging/index.js';
import { IConfig, RestSchema } from '../config/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../types/index.js';
import { IDatabaseClient } from '../shared/database/index.js';
import { getMongoURI } from '../shared/utils/index.js';

@injectable()
export class RestApp {
  public constructor(
    @inject(Component.ILogger) private readonly logger: ILogger,
    @inject(Component.IConfig) private readonly config: IConfig<RestSchema>,
    @inject(Component.IDatabaseClient) private readonly dbClient: IDatabaseClient,
  ) {
    this.logger = logger.child(this.constructor.name);
  }

  public async init() {
    this.logger.info('App initialized');
    this.logger.info(`Config port: ${this.config.get('PORT')}`);

    await this.initDB();
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
}
