import dotenv from 'dotenv';
import { readFileSync, existsSync } from 'fs';

import { pathTo } from '../utils/root';

const Env = {
  _envPath: pathTo('.env'),
  _testEnvPath: pathTo('.env.test'),
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
  },

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
  },

  /**
   * Update or set value for a given property
   * inside `process.env`.
   *
   * @method set
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
  },

  /**
   * Process a string with .env definitions.
   *
   * @param {string} envContents
   * @param {boolean} [overwrite=false]
   *
   * @returns {void}
   */
  process(envContents, overwrite = false) {
    const envCollection = dotenv.parse(envContents.trim());

    Object.keys(envCollection).forEach(key => {
      if (process.env[key] === undefined || overwrite) {
        process.env[key] = this._interpolate(envCollection[key], envCollection);
      }
    });
  },

  /**
   * Casts the string value to their native data type.
   *
   * @method _castValue
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
  },

  /**
   * Interpolates the referenced values.
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
  },

  /**
   * Interpolating the escaped sequence.
   * @private
   *
   * @param {string} value
   *
   * @returns {string}
   */
  _interpolateEscapedSequence(value) {
    return `$${value}`;
  },

  /**
   * Interpolating the variable reference starting with a
   * `$`. We only capture numbers,letter and underscore.
   * For other characters, one can use the mustache
   * braces.
   *
   * @method _interpolateVariable
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
  },

  /**
   * Interpolating the token wrapped inside the mustache
   * braces.
   *
   * @method _interpolateMustache
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
  },

  /**
   * Returns a value for a given key from the environment variable or the
   * current parsed object.
   *
   * @method _getValue
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
  },

  /**
   * Initializes Env and processes env files
   *
   * @returns {ThisType}
   */
  init() {
    const envData = existsSync(this._envPath)
      ? readFileSync(this._envPath, 'utf-8')
      : '';
    const testEnvData = existsSync(this._testEnvPath)
      ? readFileSync(this._testEnvPath, 'utf-8')
      : '';

    Env.process(envData);
    if (process.env.NODE_ENV === 'testing') Env.process(testEnvData, true);

    return this;
  },
};

Env.set('NODE_ENV', Env.get('NODE_ENV', 'development'));

const initializedEnv = Env.init();
export const EnvObject = Env;
export const defaultEnv = initializedEnv;
export default initializedEnv;
