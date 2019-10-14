const get = require('lodash.get');
const mergeWith = require('lodash.mergewith');
const set = require('lodash.set');

class Config {
  /**
   * Constructs the Config class
   *
   * @param {object} DependencyInjection
   * @param {import('../di')} DependencyInjection.Container
   * @param {import('@coobo/app')} DependencyInjection.Application
   */
  constructor({ Container, Application, requireAll, esmResolver }) {
    const configPath = Application.configPath();
    this._config = requireAll({
      dirname: configPath,
      filter: /^((?!index).)*$/,
      resolve: mod => {
        mod = esmResolver(mod);
        if (typeof mod === 'function') mod = mod(Container.cradle);
        return mod;
      },
    });
  }

  get(key, defaultValue = null) {
    return get(this._config, key, defaultValue);
  }

  merge(key, defaultValues, customizer = null) {
    return mergeWith(defaultValues, this.get(key), customizer);
  }

  set(key, value) {
    set(this._config, key, value);
  }

  defaults(key, value) {
    const existingValue = this.get(key);
    if (existingValue) {
      mergeWith(value, existingValue);
    }

    this.set(key, value);
  }
}

module.exports = Config;
