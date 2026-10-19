import { ContainerModule } from 'inversify';
import { Component, TRentalOffer } from '../types/index.js';
import { ConsoleLogger } from '../shared/logging/console.logger.js';
import { ILogger } from '../shared/logging/index.js';
import { IDatabaseClient, MongoDatabaseClient } from '../shared/database/index.js';
import { IFileReader } from '../shared/file-readers/file-reader.interface.js';
import { TSVReader } from '../shared/file-readers/tsv-reader.js';
import { ImportCommand } from './commands/index.js';
import { IConfig, RestConfig, RestSchema } from '../config/index.js';


export const cliModule = new ContainerModule((options) => {
  const cliLogger = new ConsoleLogger('[CLI]');
  options.bind<ILogger>(Component.ILogger).toConstantValue(cliLogger);
  options.bind<IDatabaseClient>(Component.IDatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  options.bind<IFileReader<TRentalOffer>>(Component.IFileReader).to(TSVReader).inSingletonScope();
  options.bind<IConfig<RestSchema>>(Component.IConfig).to(RestConfig).inSingletonScope();

  options.bind<ImportCommand>(Component.ImportCommand).to(ImportCommand).inSingletonScope();
});
