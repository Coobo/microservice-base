const uuid = require('uuid/v4');

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
  return next();
}

module.exports = RequestIdentifierMiddleware;
