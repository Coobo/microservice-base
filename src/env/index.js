const dotenv = require('dotenv');
const { readFileSync } = require('fs');
const { isAbsolute, join } = require('path');

/**
 * @class Env
 * @group Config
 *
 * @constructor
 * @singleton
 */
class Env {
  /**
   * @param {object} DependencyInjector
   * @param {string} DependencyInjector.appRoot
   */
  constructor({ appRoot }) {
    const { envContents, testEnvContents } = this._envFileLoader(appRoot);
    this.process(envContents, false);
    this.process(testEnvContents, true);
  }

  /**
   * @method _loadFile
   * @private
   *
   * @param {string} filePath
   * @param {boolean} [optional=false]
   *
   * @returns {string}
   */
  _loadFile(filePath, optional = false) {
    try {
      return readFileSync(filePath, 'utf-8');
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }

      if (!optional) {
        const e = new Error(`The ${filePath} file is missing`);
        e.name = 'MISSING_ENV_FILE';
        throw e;
      }
    }

    return '';
  }

  /**
   * @method _envFileLoader
   * @private
   *
   * @param {string} appRoot
   *
   * @returns {EnvContents}
   */
  _envFileLoader(appRoot) {
    const envPath = process.env.ENV_PATH || '.env';
    const absPath = isAbsolute(envPath) ? envPath : join(appRoot, envPath);

    const envContents = this._loadFile(
      absPath,
      process.env.ENV_SILENT === 'true',
    );

    let testEnvContents = '';
    if (process.env.NODE_ENV === 'testing') {
      testEnvContents = this._loadFile(join(appRoot, '.env.testing'), true);
    }

    return { testEnvContents, envContents };
  }

  /**
   * Casts the string value to their native data type.
   *
   * @method _castValue
   * @private
   *
   * @param {string} value
   *
   * @returns {string|boolean|null|undefined}
   */
  _castValue(value) {
    switch (value) {
      case 'null':
        return null;
      case 'true':
      case '1':
      case 'on':
        return true;
      case 'false':
      case '0':
      case 'off':
        return false;
      default:
        return value;
    }
  }

  /**
   * Returns a value for a given key from the environment variable or the
   * current parsed object.
   *
   * @method _getValue
   * @private
   *
   * @param {string} key
   * @param {object} parsed
   *
   * @returns {string}
   */
  _getValue(key, parsed) {
    if (process.env[key]) return process.env[key];

    if (parsed[key]) return this._interpolate(parsed[key], parsed);

    return '';
  }

  /**
   * Interpolating the token wrapped inside the mustache
   * braces.
   *
   * @method _interpolateMustache
   * @private
   *
   * @param {string} token
   * @param {object} parsed
   *
   * @returns {string}
   */
  _interpolateMustache(token, parsed) {
    /**
     * Finding the closing brace. If closing brace is missing, we
     * consider the block as a normal string
     */
    const closingBrace = token.indexOf('}');
    if (closingBrace === -1) {
      return token;
    }

    /**
     * Then we pull everything until the closing brace, except
     * the opening brace and trim off all white spaces.
     */
    const varReference = token.slice(1, closingBrace).trim();

    /**
     * Getting the value of the reference inside the braces
     */
    return `${this._getValue(varReference, parsed)}${token.slice(
      closingBrace + 1,
    )}`;
  }

  /**
   * Interpolating the escaped sequence.
   *
   * @method _interpolateEscapedSequence
   * @private
   *
   * @param {string} value
   *
   * @returns {string}
   */
  _interpolateEscapedSequence(value) {
    return `$${value}`;
  }

  /**
   * Interpolating the variable reference starting with a
   * `$`. We only capture numbers,letter and underscore.
   * For other characters, one can use the mustache
   * braces.
   *
   * @method _interpolateVariable
   * @private
   *
   * @param {string} token
   * @param {object} parsed
   *
   * @returns {string}
   */
  _interpolateVariable(token, parsed) {
    return token.replace(/[a-zA-Z0-9_]+/, key => {
      return this._getValue(key, parsed);
    });
  }

  /**
   * Interpolates the referenced values
   *
   * @method _interpolate
   * @private
   *
   * @param {string} value
   * @param {object} parsed
   *
   * @returns {string}
   */
  _interpolate(value, parsed) {
    const tokens = value.split('$');

    let newValue = '';
    let isFirstToken = true;

    while (tokens.length) {
      const token = tokens.shift();

      if (token.indexOf('\\') === 0) {
        newValue += this._interpolateEscapedSequence(tokens.shift());
      } else if (isFirstToken) {
        newValue += token.replace(/\\/, '$');
      } else if (token.startsWith('{')) {
        newValue += this._interpolateMustache(token, parsed);
      } else {
        newValue += this._interpolateVariable(token, parsed);
      }

      isFirstToken = false;
    }

    return newValue;
  }

  /**
   * Processes environment variables by parsing a string
   * in `dotfile` syntax.
   *
   * @method process
   * @public
   *
   * @param {string} envString
   * @param {boolean} [overwrite=false]
   *
   * @returns {void}
   *
   * @example
   * ```ts
   * Env.process(`
   *  PORT=3000
   *  HOST=127.0.0.1
   * `)
   * ```
   *
   * and then access it as follows
   *
   * ```ts
   * Env.get('PORT')
   *
   * // or
   * process.env.PORT
   * ```
   */
  process(envString, overwrite = false) {
    const envCollection = dotenv.parse(envString.trim());

    /**
     * Define/overwrite the process.env variables by looping
     * over the collection
     */
    Object.keys(envCollection).forEach(key => {
      if (process.env[key] === undefined || overwrite) {
        process.env[key] = this._interpolate(envCollection[key], envCollection);
      }
    });
  }

  /**
   * Get value for a key from the process.env. Since `process.env` object stores all
   * values as strings, this method will cast them to their counterpart datatypes.
   *
   * | Value | Casted value |
   * |------|---------------|
   * | 'true' | true |
   * | '1' | true |
   * | 'on' | true |
   * | 'false' | false |
   * | '0' | false |
   * | 'off' | false |
   * | 'null' | null |
   *
   * Everything else is returned as a string.
   *
   * A default value can also be defined which is returned when original value
   * is undefined.
   *
   * @method get
   * @public
   *
   * @param {string} key
   * @param {string|boolean|null|undefined} [defaultValue]
   *
   * @returns {any}
   *
   * @example
   * ```ts
   * Env.get('PORT', 3333)
   * ```
   */
  get(key, defaultValue = null) {
    const value = process.env[key];

    if (value === undefined) {
      return defaultValue;
    }

    return this._castValue(value);
  }

  /**
   * The method is similar to it's counter part [[get]] method. However, it will
   * raise exception when the original value is non-existing.
   *
   * `undefined`, `null` and `empty strings` are considered as non-exisitng values.
   *
   * We recommended using this method for **environment variables** that are strongly
   * required to run the application stably.
   *
   * @method getOrFail
   * @public
   *
   * @param {string} key
   * @param {any} [defaultValue=null]
   *
   * @returns {string|boolean}
   *
   * @example
   * ```ts
   * Env.getOrFail('PORT', 3333)
   * ```
   */
  getOrFail(key, defaultValue) {
    const value = this.get(key, defaultValue);

    if (!value && value !== false) {
      const e = new Error(`Make sure to define environment variable ${key}`);
      e.name = 'MISSING_ENV_KEY';
      throw e;
    }

    return value;
  }

  /**
   * Update or set value for a given property
   * inside `process.env`.
   *
   * @method set
   * @public
   *
   * @param {string} key
   * @param {any} value
   *
   * @returns {void}
   *
   * @example
   * ```ts
   * Env.set('PORT', 3333)
   * ```
   */
  set(key, value) {
    process.env[key] = this._interpolate(value, {});
  }
}

module.exports = Env;

/**
 * @typedef {object} EnvContents
 * @property {object} envContents
 * @property {object} testEnvContents
 */
