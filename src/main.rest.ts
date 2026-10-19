import 'reflect-metadata';
import { RestApp } from './rest/rest-app.js';
import { Component } from './types/index.js';
import { Container } from 'inversify';
import { restModule } from './rest/rest.container.js';
import { userModule } from './modules/user/index.js';
import { offerModule } from './modules/offer/offer.container.js';

const container = new Container();
container.load(restModule, userModule, offerModule);

const application = container.get<RestApp>(Component.RestApp);
await application.init();
