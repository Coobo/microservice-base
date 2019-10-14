import pinoExpress from 'express-pino-logger';
import pino from 'pino';

class Logger {
  constructor({ Config, Env, Container }) {
    this._config = Config;
    this._env = Env;
    this._registerDefaultConfiguration();

    let loggerLevel = 'info';
    if (Env.get('NODE_ENV') === 'testing') loggerLevel = 'fatal';
    if (Env.get('NODE_ENV') === 'development') loggerLevel = 'silent';

    this._logger = pino({
      prettyPrint: Config.get('log.pretty', false),
      redact: {
        paths: Config.get('log.safeWords'),
        censor: '***GDPR COMPLIANT***',
      },
      level: loggerLevel,
    });
    this._apiLogger = pinoExpress({
      logger: this._logger,
    });

    const asValue = Container.resolve('asValue');
    Container.register('Logger', asValue(this._logger));
    Container.register('ExpressLogger', asValue(this._apiLogger));
  }

  _registerDefaultConfiguration() {
    this._config.defaults('log', {
      pretty: this._env.get('NODE_ENV') === 'development',
      api: true,
      safeWords: ['password', 'key'],
    });
  }
}

export default Logger;
