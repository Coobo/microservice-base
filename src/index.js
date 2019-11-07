import id from 'uuid/v4';

import app from './app';
import config from './config';
import db from './db';
import env from './env';
import factory from './factory';
import fake from './fake';
import logger from './logger';
import validatorMiddleware from './middlewares/validator';
import queue from './queue';
import server from './server';
import capitalizeString from './utils/capitalize-string';
import dbUri from './utils/db-uri';
import esmRequire from './utils/esm-require';
import esmResolve from './utils/esm-resolve';
import requireAll from './utils/require-all';
import { appRoot, pathTo } from './utils/root';
import validator from './validator';

exports.default = {
  id,
  appRoot,
  pathTo,
  app,
  config,
  db,
  env,
  factory,
  fake,
  logger,
  server,
  capitalizeString,
  dbUri,
  esmRequire,
  esmResolve,
  requireAll,
  validator,
  validatorMiddleware,
  queue,
};

exports.id = id;
exports.appRoot = appRoot;
exports.pathTo = pathTo;
exports.app = app;
exports.config = config;
exports.db = db;
exports.env = env;
exports.factory = factory;
exports.fake = fake;
exports.logger = logger;
exports.server = server;
exports.capitalizeString = capitalizeString;
exports.dbUri = dbUri;
exports.esmRequire = esmRequire;
exports.esmResolve = esmResolve;
exports.requireAll = requireAll;
exports.validator = validator;
exports.validatorMiddleware = validatorMiddleware;
exports.queue = queue;
