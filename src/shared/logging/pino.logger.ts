import { ILogger } from './logger.interface.js';
import { Logger as PinoInstance, pino, transport } from 'pino';
import { dirname, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';
import { injectable, unmanaged } from 'inversify';

@injectable()
export class PinoLogger implements ILogger {
  private readonly logger: PinoInstance;

  constructor(
    @unmanaged() logger?: PinoInstance,
    @unmanaged() logFilePath = 'logs/rest.log'
  ) {
    if (logger) {
      // Внутренний вызов из child()
      this.logger = logger;
      return;
    }

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

  public child(context: string): ILogger {
    return new PinoLogger(this.logger.child({ context }));
  }
}
