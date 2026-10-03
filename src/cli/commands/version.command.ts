import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ICommand } from './command.interface.js';
import chalk from 'chalk';

type PackageJSONConfig = {
  version: string;
}

function isPackageJSONConfig(value: unknown): value is PackageJSONConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.hasOwn(value, 'version')
  );
}

export class VersionCommand implements ICommand {
  constructor(
    private readonly filePath: string = './package.json'
  ) {
  }

  public getName(): string {
    return 'version';
  }

  public getDescription(): string {
    return 'Выводит версию';
  }

  public getUsage(): string {
    return `--${this.getName()}`;
  }

  public async execute(..._params: string[]): Promise<void> {
    try {
      const version = this.readVersion();
      console.info(chalk.blue(version));
    } catch (error: unknown) {
      console.info(chalk.red(`Failed to read version from ${this.filePath}`));

      if (error instanceof Error) {
        console.info(chalk.red(error.message));
      }
    }
  }

  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), 'utf-8');
    const importedContent: unknown = JSON.parse(jsonContent);

    if (!isPackageJSONConfig(importedContent)) {
      throw new Error('Failed to parse json content.');
    }

    return importedContent.version;
  }
}
