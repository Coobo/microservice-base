import 'express-async-errors';

const compression = require('compression');
const cors = require('cors');
const express = require('express');
const fileUpload = require('express-fileupload');
const helmet = require('helmet');

const ContainerInjectorMiddleware = require('../middlewares/container-in-request');
const InternalExceptionHandlerMiddleware = require('../middlewares/exception-handler');
const InternalRequestIdentifierMiddleware = require('../middlewares/request-identifier');

/**
 * An Express server wrapper.
 *
 * @class
 * @singleton
 *
 * @group Application
 * @alias Server
 */
class Server {
  /**
   * @constructor
   *
   * @param {object} DependencyInjection
   * @param {import('@coobo/config').Config} DependencyInjection.Config
   */
  constructor({ Config, LoggerMiddleware }) {
    this._config = Config;
    this._express = express();
    this._middlewares = {
      exceptionHandler: InternalExceptionHandlerMiddleware,
      requestIdentifier: InternalRequestIdentifierMiddleware,
      containerInjector: ContainerInjectorMiddleware,
    };

    this._setConfigDefaults();

    this._enableCompression();
    this._ensureSecurityStandards();
    this._enableProxy();
    this._enableCORS();
    this._enableRequestParsers();

    this.use(this._middlewares.requestIdentifier);
    this.use(this._middlewares.containerInjector);
    this.use(LoggerMiddleware);
    this._enableStatusRoute();
  }

  /**
   * Boots up the server
   *
   * @method boot
   * @public
   *
   * @returns {express.Server}
   */
  boot() {
    this._registerErrorHandler();
    return this._express.listen(this._config.get('app.port', 3000));
  }

  /**
   * A proxy method for express.use
   *
   * @method use
   * @public
   *
   * @param {function[]} middlewares
   *
   * @returns {void}
   */
  use(...middlewares) {
    middlewares.forEach(middleware => this._express.use(middleware));
  }

  _setConfigDefaults() {
    this._config.defaults('server', {
      proxy: true,
      compression: true,
      cors: {
        enabled: true,
        origins: ['localhost', '127.0.0.1'],
        methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: [
          'Origin',
          'X-Requested-With',
          'Content-Type',
          'Accept',
          'Authorization',
          'Needed-Permissions',
          'RequestID',
        ],
      },
      req: { types: ['json'] },
    });
  }

  /**
   * Ensures the security standards and applies helmet
   *
   * @method _ensureSecurityStandards
   * @private
   *
   * @returns {void}
   */
  _ensureSecurityStandards() {
    this._express.disable('x-powered-by');
    this.use(helmet());
  }

  /**
   * Enables the proxy trust for the server
   *
   * @method _enableProxy
   * @private
   *
   * @returns {void}
   */
  _enableProxy() {
    if (this._config.get('server.proxy') === true) {
      this._express.set('trust proxy', true);
      this._express.set('trust proxy', 'loopback');
    }
  }

  /**
   * Enables a `/status` route.
   *
   * @method _enableStatusRoute
   * @private
   *
   * @returns{void}
   */
  _enableStatusRoute() {
    this._express.get('/status', (req, res) => res.sendStatus(200));
    this._express.get('/error', () => {
      throw new Error('Error route reached');
    });
  }

  /**
   * Enabled GZIP compression for all routes.
   *
   * @method _enableCompression
   * @private
   *
   * @returns {void}
   */
  _enableCompression() {
    if (this._config.get('server.compression')) this.use(compression());
  }

  /**
   * Enabled CORS for all routes.
   *
   * @method _enableCORS
   * @private
   *
   * @returns {void}
   */
  _enableCORS() {
    if (this._config.get('server.cors.enabled', true)) {
      const options = {
        origin: this._config.get('server.cors.origins'),
        methods: this._config.get('server.cors.methods'),
        allowedHeaders: this._config.get('server.cors.allowedHeaders'),
      };
      this._express.options('*', cors(options));
      this.use(cors(options));
    }
  }

  /**
   * Enables requests parsers.
   *
   * @method _enableRequestParsers
   * @private
   *
   * @returns {void}
   */
  _enableRequestParsers() {
    const config = this._config.get('server.req.types', ['json']);

    if (config.includes('raw')) this.use(express.raw());
    if (config.includes('text')) this.use(express.text());
    if (config.includes('urlencoded'))
      this.use(
        express.urlencoded({
          limit: '50mb',
          extended: true,
          parameterLimit: 50000,
        }),
      );
    if (config.includes('json')) this.use(express.json({ limit: '50mb' }));
    if (config.includes('file')) this.use(fileUpload());
  }

  /**
   * Registers the Error Handler Middleware
   *
   * @method _registerErrorHandler
   * @private
   *
   * @returns {void}
   */
  _registerErrorHandler() {
    this.use(this._middlewares.exceptionHandler);
  }
}

module.exports = Server;
