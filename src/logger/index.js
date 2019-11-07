import pino from 'pino';

import Config from '../config';

Config.defaults('log', {
  level: Config._env.get(
    'LOGGER_LEVEL',
    Config.get('env') === 'testing' ? 'silent' : 'trace',
  ),
  pretty: Config._env.get('LOGGER_PRETTY', Config.get('env') === 'development'),
  api: Config._env.get('LOGGER_API', true),
  safeWords: Config._env.get('LOGGER_SAFE_WORDS', [
    'password',
    'key',
    'password_confirmation',
  ]),
});

const Logger = pino({
  prettyPrint: Config.get('log.pretty'),
  redact: {
    paths: Config.get('log.safeWords'),
    censor: '***GDPR COMPLIANT***',
  },
  level: Config.get('log.level'),
});

Logger.profiles = {};
Logger.profile = function profile(name, level = 'info') {
  if (this.profiles[name]) {
    const diff = process.hrtime(this.profiles[name]);
    const diffMs = (diff[0] * 1e9 + diff[1]) / 1e6;
    delete this.profiles[name];
    return this[level]({ msg: name, ms: diffMs });
  }

  this.profiles[name] = process.hrtime();
  return this.profiles[name];
};

export default Logger;
