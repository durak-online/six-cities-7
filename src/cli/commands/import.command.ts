import { Command } from './command.interface.js';
import { TSVReader } from '../../shared/file-readers/tsv-reader.js';

export class ImportCommand implements Command {
  private reader: TSVReader = new TSVReader();

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
      console.log(this.reader.readFile(filename));
    } catch (err) {

      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(`Can't import data from file: ${filename}`);
      console.error(`Details: ${err.message}`);
    }
  }
}
