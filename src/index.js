import id from 'uuid/v4';

import app from './app';
import boot from './boot';
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
  boot,
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

exports.app = app;
exports.appRoot = appRoot;
exports.boot = boot;
exports.capitalizeString = capitalizeString;
exports.config = config;
exports.db = db;
exports.dbUri = dbUri;
exports.env = env;
exports.esmRequire = esmRequire;
exports.esmResolve = esmResolve;
exports.factory = factory;
exports.fake = fake;
exports.id = id;
exports.logger = logger;
exports.pathTo = pathTo;
exports.queue = queue;
exports.requireAll = requireAll;
exports.server = server;
exports.validator = validator;
exports.validatorMiddleware = validatorMiddleware;
