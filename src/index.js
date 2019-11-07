import id from 'uuid/v4';

import app from './app';
import config from './config';
import db from './db';
import env from './env';
import factory from './factory';
import fake from './fake';
import logger from './logger';
import server from './server';
import capitalizeString from './utils/capitalize-string';
import dbUri from './utils/db-uri';
import esmRequire from './utils/esm-require';
import esmResolve from './utils/esm-resolve';
import requireAll from './utils/require-all';
import { appRoot, pathTo } from './utils/root';
import validator from './validator';

export default {
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
};
