import { Command } from './commands/index.js';
import { CommandParser } from './command-parser.js';

type CommandCollection = Record<string, Command>;

export class CLIApp {
  private commands: CommandCollection = {};

  constructor(
    private readonly defaultCommand: string
  ) {
  }

  public registerCommands(commands: Command[]): void {
    commands.forEach((command) => {
      if (Object.hasOwn(this.commands, command.getName())) {
        throw new Error(`Command ${command.getName()} is already registered`);
      }
      this.commands[command.getName()] = command;
    });
  }

  public getCommand(commandName: string): Command {
    return this.commands[commandName] ?? this.getDefaultCommand();
  }

  public getDefaultCommand(): Command | never {
    if (!this.commands[this.defaultCommand]) {
      throw new Error(`The default command (${this.defaultCommand}) is not registered.`);
    }
    return this.commands[this.defaultCommand];
  }

  public async processCommand(argv: string[]): Promise<void> {
    const parsed = CommandParser.parse(argv);
    const [rawName] = Object.keys(parsed);
    const commandName = rawName?.replace(/^--/, '');

    const command = this.getCommand(commandName);
    await command.execute(...(parsed[rawName] ?? []));
  }
}
