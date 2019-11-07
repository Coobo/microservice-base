import mongoose from 'mongoose';

import config from '../config';
import env from '../env';
import logger from '../logger';
import dbUri from '../utils/db-uri';
import esmRequire from '../utils/esm-require';

const DB_HOST = env.get('DB_HOST');
const DB_PORT = env.get('DB_PORT');
const DB_USER = env.get('DB_USER');
const DB_PASS = env.get('DB_PASS');
const DB_NAME = env.get('DB_NAME');
const DB_URI = env.get(
  'DB_URI',
  dbUri(DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS),
);

config.defaults('db', {
  uri: DB_URI,
  host: DB_HOST,
  port: DB_PORT,
  name: DB_NAME,
  user: DB_USER,
  password: DB_PASS,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  },
});

const Database = {
  /**
   * The Database connection
   *
   * @type {mongoose.Connection}
   */
  _connection: new mongoose.Mongoose(),

  /**
   * The Database URI to connect to.
   *
   * @type {string}
   * @private
   */
  _uri: config.get('db.uri'),

  /**
   * The Database connection options.
   *
   * @type {object}
   * @private
   */
  _options: config.get('db.options'),

  /**
   * Internal loaded models.
   *
   * @type {Object<string,mongoose.Model>}
   */
  models: {},

  /**
   * Internal used mongoose.
   *
   * @type {mongoose}
   */
  mongoose,

  /**
   * Connects to the database using the config provider.
   *
   * @returns {void}
   */
  connect() {
    logger.profile('MONGODB_CONNECT');
    this._connection.connect(this._uri, this._options);

    this._connection.connection.on('error', error => {
      logger.error({
        msg: 'There was an error with the database connection.',
        error,
      });
    });

    this._connection.connection.once('open', () => {
      logger.profile('MONGODB_CONNECT', 'debug');
      logger.debug(
        `${config.get(
          'app.name',
          'Application',
        )} successfully connected to MongoDB`,
      );
    });
  },

  /**
   * Gets the specified mongoose model.
   *
   * @param {string} name
   *
   * @returns {mongoose.Model}
   */
  get(name) {
    if (name.includes('Model')) name = name.replace('Model', '');

    return this.models[name];
  },

  /**
   * Gets the specified mongoose model.
   *
   * @param {string} name
   *
   * @returns {mongoose.Model}
   */
  add(model, name = null) {
    if (!name) name = model.modelName;

    this.models[name] = model;
  },

  /**
   * Checks if the database has the specified mongoose model.
   *
   * @param {string} name
   *
   * @returns {boolean}
   */
  has(name) {
    if (name.includes('Model')) name = name.replace('Model', '');

    return this.models[name] !== undefined;
  },

  /**
   * Loads a new model to the database.
   *
   * @param {string} modelPath
   * @param {string} [name=null]
   *
   * @returns {void}
   */
  load(modelPath, name = null) {
    const model = esmRequire(modelPath)(this._connection, this.models);
    if (!name) name = model.modelName;

    this.models[name] = model;
  },
};

export default Database;
