#!/usr/bin/env node

import { ICommand, GenerateCommand, HelpCommand, ImportCommand, VersionCommand } from './commands/index.js';
import { CLIApp } from './cli-app.js';
import { Container } from 'inversify';
import { userModule } from '../modules/user/index.js';
import { offerModule } from '../modules/offer/offer.container.js';
import { Component } from '../types/index.js';
import { cliModule } from './cli.container.js';

const container = new Container();

container.load(userModule, offerModule, cliModule);

const importCommand = container.get<ImportCommand>(Component.ImportCommand);

const helpCommand = new HelpCommand();
const commands: ICommand[] = [
  helpCommand,
  new VersionCommand(),
  importCommand,
  new GenerateCommand(),
];

helpCommand.registerCommands(commands);

const app = new CLIApp(helpCommand.getName());
app.registerCommands(commands);

await app.processCommand(process.argv);
