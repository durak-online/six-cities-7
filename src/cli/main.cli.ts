import { HelpCommand } from './commands/help.command.js';
import { VersionCommand } from './commands/version.command.js';
import { Command } from './commands/command.interface.js';
import { CLIApp } from './cli-app.js';

const helpCommand = new HelpCommand();
const commands: Command[] = [
  helpCommand,
  new VersionCommand(),
];

helpCommand.registerCommands(commands);

const app = new CLIApp(helpCommand.getName());
app.registerCommands(commands);

app.processCommand(process.argv);
