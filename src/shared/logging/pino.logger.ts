import { ILogger } from './logger.interface.js';
import { Logger as PinoInstance, pino, transport } from 'pino';
import { dirname, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';

export class PinoLogger implements ILogger {
  private readonly logger: PinoInstance;

  constructor(logFilePath = 'logs/rest.log') {
    const destination = resolve(process.cwd(), logFilePath);
    mkdirSync(dirname(destination), { recursive: true });

    const multiTransport = transport({
      targets: [
        {
          target: 'pino/file',
          level: 'debug',
          options: { destination },
        },
        {
          target: 'pino/file',
          level: 'info',
          options: {},
        }
      ],
    });

    this.logger = pino({}, multiTransport);
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...(args as any[]));
  }

  public error(message: string, error: Error, ...args: unknown[]): void {
    this.logger.error(error, message, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...(args as any[]));
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...(args as any[]));
  }

}
