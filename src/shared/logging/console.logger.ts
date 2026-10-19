import { ILogger } from './logger.interface.js';

export class ConsoleLogger implements ILogger {
  constructor(
    private context = '',
  ) {
  }

  public debug(message: string, ...args: unknown[]): void {
    console.debug(`${this.context} ${message}`, ...args);
  }

  public error(message: string, error: Error, ...args: unknown[]): void {
    console.error(`${this.context} ${message}: ${error.message}`, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    console.info(`${this.context} ${message}`, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    console.warn(`${this.context} ${message}`, ...args);
  }

  public child(context: string): ILogger {
    return new ConsoleLogger(`${this.context}[${context}]`);
  }
}
