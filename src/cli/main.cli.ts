#!/usr/bin/env node

import { ICommand, GenerateCommand, HelpCommand, ImportCommand, VersionCommand } from './commands/index.js';
import { CLIApp } from './cli-app.js';

const helpCommand = new HelpCommand();
const commands: ICommand[] = [
  helpCommand,
  new VersionCommand(),
  new ImportCommand(),
  new GenerateCommand(),
];

helpCommand.registerCommands(commands);

const app = new CLIApp(helpCommand.getName());
app.registerCommands(commands);

await app.processCommand(process.argv);
