import config from '../config';
import unauthorized from '../responses/unauthorized';
import validator from '../validator';

config.defaults('server.authentication', {
  enabled: config._env.get('SERVER_AUTH_ENABLED', true),
  useKey: config._env.get('SERVER_AUTH_USE_KEY', true),
  allowedKeys: config._env.get('SERVER_AUTH_KEYS', '').split(','),
  useUser: config._env.get('SERVER_AUTH_USE_USER', false),
  forceUser: config._env.get('SERVER_AUTH_FORCE_USER', false),
});

/**
 * Middleware responsible for catching api errors.
 *
 * @middleware
 * @async
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 *
 * @returns {void}
 */
async function AuthenticationProviderMiddleware(req, res, next) {
  if (!config.get('server.authentication.enabled')) return next();

  req.auth = {
    isAuthenticated: false,
  };

  if (config.get('server.authentication.useUser')) {
    if (req.headers.userId) {
      const { userId } = req.headers;
      const schema = validator.string().guid({ version: 4 });
      const result = schema.validate(userId);

      if (result.error) {
        return unauthorized({ res, reason: "Invalid 'UserId' Header." });
      }

      req.auth.userId = req.headers.userId;
    } else if (config.get('server.authentication.forceUser')) {
      return unauthorized({ res, reason: "Missing 'UserId' Header." });
    }
  }

  if (config.get('server.authentication.useKey') && req.headers.key) {
    const allowedKeys = config.get('server.authentication.allowedKeys');
    if (!allowedKeys.includes(req.headers.key))
      return unauthorized({ res, reason: 'Invalid authentication key.' });

    req.auth.isAuthenticated = true;
    req.auth.key = req.headers.key;
  }

  return next();
}

module.exports = AuthenticationProviderMiddleware;
