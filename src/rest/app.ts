import { ILogger } from '../shared/logging/index.js';
import { IConfig, RestSchema } from '../config/index.js';

export class App {
  public constructor(
    private readonly logger: ILogger,
    private readonly config: IConfig<RestSchema>,
  ) {
  }

  public async init() {
    this.logger.info('App initialized');
    this.logger.info(`Config port: ${this.config.get('PORT')}`);
  }
}
