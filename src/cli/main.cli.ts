#!/usr/bin/env node

import { Command, HelpCommand, ImportCommand, VersionCommand } from './commands/index.js';
import { CLIApp } from './cli-app.js';

const helpCommand = new HelpCommand();
const commands: Command[] = [
  helpCommand,
  new VersionCommand(),
  new ImportCommand(),
];

helpCommand.registerCommands(commands);

const app = new CLIApp(helpCommand.getName());
app.registerCommands(commands);

app.processCommand(process.argv);
