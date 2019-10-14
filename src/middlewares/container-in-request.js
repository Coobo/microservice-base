import container from '../di';

/**
 * Middleware responsible for identifying incoming requests.
 *
 * @middleware
 * @function ContainerInjectorMiddleware
 * @alias ContainerInjectorMiddleware
 * @group Application
 * @async
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 *
 * @returns {void}
 */
async function ContainerInjectorMiddleware(req, res, next) {
  req.container = container.createScope();
  return next();
}

module.exports = ContainerInjectorMiddleware;
