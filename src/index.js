import Application from './app';
import controller from './app/controller';
import middleware from './app/middleware';
import Config from './config';
import Database from './db';
import Container from './di';
import Env from './env';
import Factory from './factory';
import Fake from './fake';
import LoggerClass from './log';
import LoggerMiddleware from './middlewares/logger';
import Server from './server';

const asClass = Container.resolve('asClass');
const asFunction = Container.resolve('asFunction');
const asValue = Container.resolve('asValue');

Container.register({
  Application: asClass(Application).singleton(),
  Env: asClass(Env).singleton(),
  Config: asClass(Config).singleton(),
  Database: asFunction(Database).singleton(),
  Factory: asClass(Factory).singleton(),
  fake: asValue(Fake),
  LoggerClass: asClass(LoggerClass).singleton(),
  LoggerMiddleware: asFunction(LoggerMiddleware).singleton(),
  Server: asClass(Server).singleton(),
  controller: asFunction(controller).singleton(),
  middleware: asFunction(middleware).singleton(),
  Validator: asValue(Validator),
});

module.exports = Container;
