import { App } from './rest/app.js';
import { PinoLogger } from './shared/logging/index.js';
import { RestConfig } from './config/index.js';

const logger = new PinoLogger();
const config = new RestConfig(logger);
const app = new App(logger, config);

await app.init();
