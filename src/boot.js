import app from './app';
import db from './db';
import logger from './logger';
import server from './server';
import esmResolve from './utils/esm-resolve';
import requireAll from './utils/require-all';

function boot() {
  logger.trace('Booting up application...');

  const requireOptions = {
    dirname: app.domainsPath(),
    resolve: (mod, path) => {
      logger.trace(`Loaded: ${path}`);
      return esmResolve(mod);
    },
  };

  app.load();
  server.init();
  db.connect();

  requireAll({ filter: /model\.js$/, ...requireOptions });
  requireAll({ filter: /routes\.js$/, ...requireOptions });
  if (app.isTest) requireAll({ filter: /seeder\.js$/, ...requireOptions });

  return server;
}

export default boot;
