import 'reflect-metadata';
import { RestApp } from './rest/rest-app.js';
import { ILogger, PinoLogger } from './shared/logging/index.js';
import { IConfig, RestConfig, RestSchema } from './config/index.js';
import { Container } from 'inversify';
import { Component } from './types/index.js';

const container = new Container();

container
  .bind<RestApp>(Component.RestApp)
  .to(RestApp)
  .inSingletonScope();

container
  .bind<ILogger>(Component.ILogger)
  .to(PinoLogger)
  .inSingletonScope();

container
  .bind<IConfig<RestSchema>>(Component.IConfig)
  .to(RestConfig)
  .inSingletonScope();

const application = container.get<RestApp>(Component.RestApp);
await application.init();
