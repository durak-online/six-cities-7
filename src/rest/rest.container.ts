import { ContainerModule } from 'inversify';
import { RestApp } from './rest-app.js';
import { Component } from '../types/index.js';
import { ILogger, PinoLogger } from '../shared/logging/index.js';
import { IConfig, RestConfig, RestSchema } from '../config/index.js';
import { IDatabaseClient, MongoDatabaseClient } from '../shared/database/index.js';

export const restModule = new ContainerModule((options) => {
  options.bind<RestApp>(Component.RestApp).to(RestApp).inSingletonScope();
  options.bind<ILogger>(Component.ILogger).to(PinoLogger).inSingletonScope();
  options.bind<IConfig<RestSchema>>(Component.IConfig).to(RestConfig).inSingletonScope();
  options.bind<IDatabaseClient>(Component.IDatabaseClient).to(MongoDatabaseClient).inSingletonScope();
});
