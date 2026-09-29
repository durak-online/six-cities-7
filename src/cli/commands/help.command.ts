import { Command } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  private commands: Command[] = [];

  public getName(): string {
    return 'help';
  }

  public getDescription(): string {
    return 'Печатает текст подсказки';
  }

  public getUsage(): string {
    return `--${this.getName()}`;
  }

  public execute(..._params: string[]): void {
    const commandsList = this.formatCommands();

    console.info(`
${chalk.bold('Программа для подготовки данных для REST API сервера.')}

Пример: ${chalk.cyan('main.cli.js --<command> [arguments]')}

${chalk.bold('Команды:')}
${commandsList}
  `);
  }

  public registerCommands(commands: Command[]): void {
    this.commands = commands;
  }

  private formatCommands(): string {
    const maxNameLength = this.commands.reduce(
      (max, command) => Math.max(max, command.getUsage().length),
      0,
    );

    if (this.commands.length === 0) {
      return chalk.gray('    (команды не зарегистрированы)');
    }

    return this.commands
      .map((command) => {
        const usage = command.getUsage().padEnd(maxNameLength);
        const description = command.getDescription();

        return `${chalk.cyan(usage)}  ${chalk.gray(`# ${description}`)}`;
      })
      .join('\n');
  }
}
