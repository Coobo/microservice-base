import config from '../config';
import { appRoot as APP_ROOT, pathTo } from '../utils/root';

const ENV = config.get('env');

const PACKAGE = require(pathTo('package.json'));

config.defaults('app', {
  root: APP_ROOT,
  folder: ['development', 'testing'].includes(ENV) ? 'src' : 'dist',
  inTest: ENV === 'testing',
  inProduction: ENV === 'production',
  inStaging: ENV === 'staging',
  inDev: ENV === 'development',
  name: 'spendfy-service',
  paths: {
    domains: 'app/domains',
  },
});

const Application = {
  root: config.get('app.root'),
  folder: config.get('app.folder'),
  env: config.get('env'),
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
    this.env = config.get('env');
    this.inTest = config.get('app.inTest');
    this.inProd = config.get('app.inProduction');
    this.inStage = config.get('app.inStaging');
    this.inDev = config.get('app.inDev');
    this.name = config.get('app.name');
  },
};

export default Application;
