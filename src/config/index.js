import get from 'lodash.get';
import mergeWith from 'lodash.mergewith';
import set from 'lodash.set';

import Env from '../env';
import esmResolve from '../utils/esm-resolve';
import requireAll from '../utils/require-all';
import { pathTo } from '../utils/root';

const CONFIG_PATH = Env.get(
  'CONFIG_PATH',
  pathTo(
    ['development', 'testing'].includes(Env.get('NODE_ENV', 'development'))
      ? 'src'
      : 'dist',
    'config',
  ),
);

/**
 * @name Config
 */
const Config = {
  /**
   * An array with all configuration objects available.
   *
   * @type {object[]}
   * @private
   */
  _config: requireAll({
    dirname: CONFIG_PATH,
    resolve: mod => {
      const resolvedModule = esmResolve(mod);
      return typeof resolvedModule === 'function'
        ? resolvedModule(Env)
        : resolvedModule;
    },
  }),

  /**
   * Reference to the Env Object.
   *
   * @type {Env}
   * @private
   */
  _env: Env,

  /**
   * Gets a configuration or returns a defaultValue if the requests config is
   * not available.
   *
   * @param {string} key
   * @param {*} [defaultValue=null]
   *
   * @returns {*}
   */
  get(key, defaultValue = null) {
    return get(this._config, key, defaultValue);
  },

  /**
   * Merges a configuration key with default values using a customizer.
   *
   * @param {string} key
   * @param {object} defaultValues
   * @param {function} [customizer=null]
   *
   * @returns {*}
   */
  merge(key, defaultValues, customizer = null) {
    return mergeWith(defaultValues, this.get(key), customizer);
  },

  /**
   * Sets a configuration
   *
   * @param {string} key
   * @param {*} value
   *
   * @returns {void}
   */
  set(key, value) {
    set(this._config, key, value);
  },

  /**
   * Sets a configuration merging it with previously set values.
   *
   * @param {string} key
   * @param {*} value
   *
   * @returns {void}
   */
  defaults(key, value) {
    const existingValue = this.get(key);
    if (existingValue) {
      mergeWith(value, existingValue);
    }

    this.set(key, value);
  },
};

Config.set('env', Env.get('NODE_ENV', 'development'));

export default Config;
