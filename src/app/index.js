import config from '../config';
import logger from '../logger';
import esmResolve from '../utils/esm-resolve';
import requireAll from '../utils/require-all';
import { appRoot as APP_ROOT, pathTo } from '../utils/root';

const PACKAGE = require(pathTo('package.json'));

config.defaults('app', {
  root: APP_ROOT,
  folder: ['development', 'testing'].includes(
    config._env.get('NODE_ENV', 'development'),
  )
    ? 'src'
    : 'dist',
  inTest: config._env.get('NODE_ENV', 'development') === 'testing',
  inProduction: config._env.get('NODE_ENV', 'development') === 'production',
  inStaging: config._env.get('NODE_ENV', 'development') === 'staging',
  inDev: config._env.get('NODE_ENV', 'development') === 'development',
  name: 'spendfy-service',
  paths: {
    domains: 'app/domains',
  },
});

const Application = {
  root: config.get('app.root'),
  folder: config.get('app.folder'),
  env: config._env.get('NODE_ENV', 'development'),
  inTest: config.get('app.inTest'),
  inProd: config.get('app.inProduction'),
  inStage: config.get('app.inStaging'),
  inDev: config.get('app.inDev'),
  name: config.get('app.name'),
  package: PACKAGE,
  version: PACKAGE.version || '0.0.0',
  coreVersion: PACKAGE.dependencies['@coobo/base'],

  /**
   * Returns a relative path to the root.
   *
   * @param {string[]} paths
   *
   * @returns {string}
   */
  path(...paths) {
    return pathTo(this.folder, ...paths);
  },

  get domainsPath() {
    return this.path(config.get('app.paths.domains'));
  },

  load() {
    this.root = config.get('app.root');
    this.folder = config.get('app.folder');
    this.env = config._env.get('NODE_ENV', 'development');
    this.inTest = config.get('app.inTest');
    this.inProd = config.get('app.inProduction');
    this.inStage = config.get('app.inStaging');
    this.inDev = config.get('app.inDev');
    this.name = config.get('app.name');
  },

  boot({ server, db }) {
    this.load();

    const requireOptions = {
      dirname: this.domainsPath,
      resolve: (mod, path) => {
        logger.trace(`Loaded: ${path}`);
        return esmResolve(mod);
      },
    };

    server.init();
    db.connect();

    requireAll({ filter: /model\.js$/, ...requireOptions });
    requireAll({ filter: /routes\.js$/, ...requireOptions });
    if (this.inTest) requireAll({ filter: /seeder\.js$/, ...requireOptions });

    return server;
  },
};

export default Application;
