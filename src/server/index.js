import 'express-async-errors';

import BullBoard from 'bull-board';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';

import config from '../config';
import logger from '../logger';
import apiLogger from '../logger/api';
import exceptionHandlerMiddleware from '../middlewares/exception-handler';
import requestIdentifierMiddleware from '../middlewares/request-identifier';
import queue from '../queue';

config.defaults('server', {
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

const Server = {
  _express: express(),
  _compression() {
    if (config.get('server.compression')) this.use(compression());
  },
  _security() {
    this._express.disable('x-powered-by');
    this.use(helmet());
  },
  _proxy() {
    if (config.get('server.proxy') === true) {
      this._express.set('trust proxy', true);
      this._express.set('trust proxy', 'loopback');
    }
  },
  _statusRoute() {
    this._express.get('/status', (req, res) => res.sendStatus(200));
    this._express.get('/error', () => {
      throw new Error('Error route reached');
    });
  },
  _cors() {
    if (config.get('server.cors.enabled', true)) {
      const options = {
        origin: config.get('server.cors.origins'),
        methods: config.get('server.cors.methods'),
        allowedHeaders: config.get('server.cors.allowedHeaders'),
      };
      this._express.options('*', cors(options));
      this.use(cors(options));
    }
  },
  _parsers() {
    const requestTypes = config.get('server.req.types');

    if (requestTypes.includes('raw')) this.use(express.raw());
    if (requestTypes.includes('text')) this.use(express.text());
    if (requestTypes.includes('urlencoded'))
      this.use(
        express.urlencoded({
          limit: '50mb',
          extended: true,
          parameterLimit: 50000,
        }),
      );
    if (requestTypes.includes('json'))
      this.use(express.json({ limit: '50mb' }));
    if (requestTypes.includes('file')) this.use(fileUpload());
  },
  _exceptionHandler() {
    this.use(exceptionHandlerMiddleware);
  },

  /**
   * If queue is enabled, adds a queue admin panel to routes.
   *
   * @returns {void}
   */
  _board() {
    if (config.get('queue.enabled')) {
      BullBoard.setQueues(queue.queuesArray);
      this.useRouter('/admin/queues', BullBoard.UI);
    }
  },

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
  },

  init() {
    this._compression();
    this._security();
    this._proxy();
    this._cors();
    this._parsers();

    this.use(requestIdentifierMiddleware);

    this.use(apiLogger);
    this._statusRoute();
    this._board();
  },

  boot() {
    this._exceptionHandler();
    const PORT = config.get('app.port', 3000);

    return this._express.listen(PORT, () =>
      logger.info(
        `${config.get('app.name', 'Apllication')} listening to port ${PORT}.`,
      ),
    );
  },

  /**
   * Open Router
   *
   * @method openRouter
   * @public
   *
   * @returns {import('express').Router}
   */
  openRouter() {
    return new express.Router();
  },

  /**
   * Use Router
   *
   * @method useRouter
   * @public
   *
   * @param {string} basePath
   * @param {import('express').Router} router
   *
   * @returns {void}
   */
  useRouter(...params) {
    this._express.use(...params);
  },
};

export default Server;
