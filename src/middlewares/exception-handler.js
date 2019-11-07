import Youch from 'youch';

import config from '../config';

/**
 * Middleware responsible for catching api errors.
 *
 * @middleware
 * @function ExceptionHandlerMiddleware
 * @alias ExceptionHandlerMiddleware
 * @group Application
 * @async
 * @type {import('express').ErrorRequestHandler}
 *
 * @param {import('express').Errback} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 *
 * @returns {void}
 */
async function ExceptionHandlerMiddleware(err, req, res, next) {
  req.log.error({ msg: 'An error ocurred while operating the request.', err });
  if (['development', 'testing'].includes(config.get('env'))) {
    const errors = await new Youch(err, req).toJSON();

    return res.status(500).json(errors);
  }

  return res.status(500).json({ error: 'Internal server error' });
}

module.exports = ExceptionHandlerMiddleware;
