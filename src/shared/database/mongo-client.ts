import * as Mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { setTimeout } from 'node:timers/promises';
import { Component } from '../../types/index.js';
import { ILogger } from '../logging/index.js';
import { IDatabaseClient } from './database-client.interface.js';

const RETRY_COUNT = 5;
const RETRY_TIMEOUT_MS = 1000;

@injectable()
export class MongoDatabaseClient implements IDatabaseClient {
  private mongoose!: typeof Mongoose;
  private _isConnected: boolean;

  constructor(
    @inject(Component.ILogger) private readonly logger: ILogger
  ) {
    this._isConnected = false;
  }

  public isConnected() {
    return this._isConnected;
  }

  public async connect(uri: string): Promise<void> {
    if (this._isConnected) {
      throw new Error('MongoDB client already connected');
    }

    this.logger.info('Trying to connect to MongoDB…');

    let attempt = 0;
    while (attempt < RETRY_COUNT) {
      try {
        this.mongoose = await Mongoose.connect(uri);
        this._isConnected = true;
        this.logger.info('Database connection established.');
        return;
      } catch (error) {
        attempt++;
        this.logger.error(`Failed to connect to the database. Attempt ${attempt}`, error as Error);
        await setTimeout(RETRY_TIMEOUT_MS);
      }
    }

    throw new Error(`Unable to establish database connection after ${RETRY_COUNT}`);
  }

  public async disconnect(): Promise<void> {
    if (!this._isConnected) {
      throw new Error('Not connected to the database');
    }

    await this.mongoose.disconnect?.();
    this._isConnected = false;
    this.logger.info('Database connection closed.');
  }
}
