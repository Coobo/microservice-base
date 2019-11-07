import pinoExpress from 'express-pino-logger';

import logger from './index';

export default pinoExpress({ logger });
