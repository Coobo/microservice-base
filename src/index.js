import Application from './app';
import controller from './app/controller';
import middleware from './app/middleware';
import validate from './app/validate';
import Config from './config';
import Database from './db';
import Container from './di';
import Env from './env';
import Factory from './factory';
import Fake from './fake';
import Logger from './log';
import APILogger from './log/api';
import ValidatorMiddleware from './middlewares/validator';
import Server from './server';
import Validator from './validator';

const asClass = Container.resolve('asClass');
const asFunction = Container.resolve('asFunction');
const asValue = Container.resolve('asValue');

Container.register({
  Application: asClass(Application).singleton(),
  Config: asClass(Config).singleton(),
  controller: asFunction(controller).singleton(),
  Database: asFunction(Database).singleton(),
  Env: asClass(Env).singleton(),
  Factory: asClass(Factory).singleton(),
  fake: asValue(Fake),
  LoggerClass: asFunction(Logger).singleton(),
  APILoggerClass: asFunction(APILogger).singleton(),
  middleware: asFunction(middleware).singleton(),
  Server: asClass(Server).singleton(),
  validate: asFunction(validate).singleton(),
  Validator: asValue(Validator),
  ValidatorMiddleware: asValue(ValidatorMiddleware),
});

module.exports = Container;
