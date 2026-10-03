import { existsSync, statSync } from 'node:fs';
import { extname } from 'node:path';
import { Command } from './command.interface.js';
import { TSVReader } from '../../shared/file-readers/tsv-reader.js';
import chalk from 'chalk';

const REQUIRED_EXTENSION = '.tsv';

export class ImportCommand implements Command {
  private readonly reader = new TSVReader();

  public getName(): string {
    return 'import';
  }

  public getDescription(): string {
    return 'Импортирует данные из TSV';
  }

  public getUsage(): string {
    return `--${this.getName()} <path>`;
  }

  public execute(...params: string[]): void {
    const [filename] = params;

    try {
      this.validateFile(filename);
      this.reader.read(filename);
      const offers = this.reader.toArray();

      console.info(`Импортировано ${offers.length} предложений из "${filename}"`);
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }

      console.info(chalk.red(`Не удалось импортировать данные из файла: ${filename ?? '(путь не указан)'}`));
      console.info(chalk.red(`Причина: ${err.message}`));
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
