import { existsSync, statSync } from 'node:fs';
import { extname } from 'node:path';
import { ICommand } from './command.interface.js';
import chalk from 'chalk';
import { inject, injectable } from 'inversify';
import { Component, TRentalOffer } from '../../types/index.js';
import { ILogger } from '../../shared/logging/index.js';
import { IDatabaseClient } from '../../shared/database/index.js';
import { IFileReader } from '../../shared/file-readers/file-reader.interface.js';
import { IUserService } from '../../modules/user/index.js';
import { IOfferService } from '../../modules/offer/offer-service.interface.js';
import { IConfig, RestSchema } from '../../config/index.js';
import { getMongoURI } from '../../shared/utils/index.js';

const REQUIRED_EXTENSION = '.tsv';

@injectable()
export class ImportCommand implements ICommand {
  constructor(
    @inject(Component.ILogger) private readonly logger: ILogger,
    @inject(Component.IDatabaseClient) private readonly dbClient: IDatabaseClient,
    @inject(Component.IFileReader) private readonly reader: IFileReader<TRentalOffer>,
    @inject(Component.IUserService) private readonly userService: IUserService,
    @inject(Component.IOfferService) private readonly offerService: IOfferService,
    @inject(Component.IConfig) private readonly config: IConfig<RestSchema>,
  ) {
  }

  public getName(): string {
    return 'import';
  }

  public getDescription(): string {
    return 'Импортирует данные из TSV';
  }

  public getUsage(): string {
    return `--${this.getName()} <filepath> [login] [password] [host] [port] [dbname] [salt]`;
  }

  public async execute(...params: string[]): Promise<void> {
    const [
      filename,
      argLogin,
      argPassword,
      argHost,
      argPort,
      argDbname,
      argSalt
    ] = params;

    if (!filename) {
      this.logger.info(`Использование: ${this.getUsage()}`);
      return;
    }

    const login = argLogin || this.config.get('DB_USER');
    const password = argPassword || this.config.get('DB_PASSWORD');
    const host = argHost || this.config.get('DB_HOST');
    const port = argPort || this.config.get('DB_PORT');
    const dbname = argDbname || this.config.get('DB_NAME');
    const salt = argSalt || this.config.get('SALT');

    const uri = getMongoURI(login, password, host, port, dbname);

    try {
      this.validateFile(filename);

      this.logger.info(`Подключение к базе данных ${host}/${dbname}...`);
      await this.dbClient.connect(uri);

      let importedCount = 0;

      for await (const offer of this.reader.read(filename)) {
        const [firstname, lastname] = offer.author.name.split(' ');
        const user = await this.userService.findOrCreate(
          {
            email: offer.author.email,
            photoUrl: offer.author.photoUrl || 'default-avatar.jpg',
            firstname: firstname || 'Unknown',
            lastname: lastname || 'User',
            password: '123456',
          },
          salt
        );

        await this.offerService.create(offer, user._id.toString());

        importedCount++;
      }

      this.logger.info(chalk.green(`Импорт завершен. Всего ${importedCount} предложений.`));
    } catch (err) {
      this.logger.error(chalk.red('Ошибка при импорте данных'), err as Error);
    } finally {
      if (this.dbClient.isConnected()) {
        await this.dbClient.disconnect();
      }
    }
  }

  private validateFile(filename: string | undefined): asserts filename is string {
    if (!filename) {
      throw new Error('No filename is provided');
    }

    if (extname(filename).toLowerCase() !== REQUIRED_EXTENSION) {
      throw new Error(`Expected ${REQUIRED_EXTENSION} extension`);
    }

    if (!existsSync(filename)) {
      throw new Error(`No file exists: ${filename}`);
    }

    if (!statSync(filename).isFile()) {
      throw new Error('Provided filename is not a file');
    }
  }
}
