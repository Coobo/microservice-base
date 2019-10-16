/**
 * A validation Middleware Factory
 *
 * @function validationMiddlewareFactory
 * @alias validationMiddlewareFactory
 * @group Application
 * @async
 *
 * @param {('body' | 'params' | 'query')} type
 * @param {import('@hapi/joi').Schema} schema
 *
 * @returns {validationMiddleware}
 */
function validationMiddlewareFactory(type, schema) {
  /**
   * Middleware responsible for validating incoming requests.
   *
   * @middleware
   * @function validationMiddleware
   * @alias validationMiddleware
   * @group Application
   * @async
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   *
   * @returns {void}
   */
  function validationMiddleware(req, res, next) {
    const data = req[type];
    const result = schema.validate(data);
    if (result.error) return res.status(400).send(result.error);

    return next();
  }

  return validationMiddleware;
}

export default validationMiddlewareFactory;
