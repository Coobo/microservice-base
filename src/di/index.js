const {
  createContainer,
  asClass,
  asValue,
  asFunction,
  aliasTo,
} = require('awilix');

const controller = require('../app/controller');
const middleware = require('../app/middleware');
const esmRequire = require('../utils/esmRequire');
const esmResolver = require('../utils/esmResolver');
const requireAll = require('../utils/requireAll');

const _container = createContainer();

_container.register({ Container: asValue(_container) });
_container.register('requireAll', asValue(requireAll));
_container.register('esmRequire', asValue(esmRequire));
_container.register('esmResolver', asValue(esmResolver));
_container.register('asClass', asValue(asClass));
_container.register('asValue', asValue(asValue));
_container.register('asFunction', asValue(asFunction));
_container.register('aliasTo', asValue(aliasTo));
_container.register('controller', asFunction(controller));
_container.register('middleware', asFunction(middleware));

module.exports = _container;
