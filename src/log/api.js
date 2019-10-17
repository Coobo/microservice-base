import pinoExpress from 'express-pino-logger';

function APILogger({ Logger }) {
  return pinoExpress({
    logger: Logger,
  });
}

export default APILogger;
