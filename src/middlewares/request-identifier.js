import uuid from 'uuid/v4';

import logger from '../logger';

/**
 * Middleware responsible for identifying incoming requests.
 *
 * @middleware
 * @function RequestIdentifierMiddleware
 * @alias RequestIdentifierMiddleware
 * @group Application
 * @async
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 *
 * @returns {void}
 */
async function RequestIdentifierMiddleware(req, res, next) {
  res.header('Request-Id', req.get('Request-Id') || uuid());
  req.identifier = res.get('Request-Id');
  req.log = logger.child({ requestId: res.get('Request-Id') });
  return next();
}

export default RequestIdentifierMiddleware;
