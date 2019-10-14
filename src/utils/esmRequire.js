const esmResolver = require('./esmResolver');

module.exports = function esmRequire(filePath) {
  return esmResolver(require(filePath));
};
