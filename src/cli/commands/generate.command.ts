import { Command } from './command.interface.js';
import { OfferGenerator } from '../../shared/generators/offer.generator.js';
import { TSVWriter } from '../../shared/file-writers/tsv-writer.js';
import { fetchJson, asIntInRange } from '../../shared/utils/index.js';
import { MockServerData } from '../../types/index.js';
import chalk from 'chalk';

const MIN_COUNT = 1;
const MAX_COUNT = 100_000;

export class GenerateCommand implements Command {
  public getName(): string {
    return 'generate';
  }

  public getDescription(): string {
    return 'Генерирует тестовые данные и сохраняет их в TSV';
  }

  public getUsage(): string {
    return `--${this.getName()} <n> <filepath> <url>`;
  }

  public async execute(...params: string[]): Promise<void> {
    const [countRaw, filePath, url] = params;

    if (!countRaw || !filePath || !url) {
      console.info(chalk.cyan(`Использование: ${this.getUsage()}`));
      return;
    }

    const writer = new TSVWriter(filePath);

    try {
      const count = asIntInRange(countRaw, MIN_COUNT, MAX_COUNT);
      const mockData = await this.loadMockData(`${url}/api`);

      console.info(`Генерируем ${count} строк...`);
      const generator = new OfferGenerator(mockData);

      for (let i = 0; i < count; i++) {
        await writer.write(generator.generate());
      }
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }

      console.info(chalk.red(`Ошибка при генерации: ${err.message}`));
    } finally {
      await writer.close();
    }

    console.info(chalk.green(`Данные записаны в "${filePath}"`));
  }

  private async loadMockData(url: string): Promise<MockServerData> {
    console.info(`Загружаем данные с ${url}...`);

    try {
      return await fetchJson<MockServerData>(url);
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      throw new Error(`Не удалось получить данные с ${url}: ${reason}`);
    }
  }
}
