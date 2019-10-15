import path from 'path';

import app from '../../src/app';
import controllerLoader from '../../src/app/controller';
import middlewareLoader from '../../src/app/middleware';
import Container from '../../src/index';

app.prototype.configPath = () => {
  return path.join(__dirname, 'config-path');
};

const asClass = Container.resolve('asClass');
const asFunction = Container.resolve('asFunction');
const asValue = Container.resolve('asValue');

Container.register('Application', asClass(app));
Container.register('controller', asFunction(controllerLoader));
Container.register('middleware', asFunction(middlewareLoader));
Container.register('appRoot', {
  resolve: () => path.join(__dirname, '../../'),
});

const s = Container.resolve('Server');

let server;

describe('@coobo/base bundle', () => {
  beforeEach(() => {
    server = s.boot();
  });

  afterEach(() => {
    server.close();
  });
  it('should be listening to port 3000', () => {
    const { port } = server.address();

    expect(port).toBe(3000);
  });
});

describe('controller helper function', () => {
  class UserController {}

  it('should load a injected controller', () => {
    Container.register('UserController', asClass(UserController));
    const controller = Container.resolve('controller');

    const uc = controller('UserController');
    expect(uc instanceof UserController).toBe(true);
  });

  it('should autocomplete the controller name with "Controller" suffix', () => {
    Container.register('User', asClass(UserController));
    const controller = Container.resolve('controller');

    const uc = controller('User');
    expect(uc instanceof UserController).toBe(true);
  });

  it('should fail when the controller does not exist', () => {
    const controller = Container.resolve('controller');

    const fn = () => controller('Company');
    expect(fn).toThrow();
  });
});

describe('middleware helper function', () => {
  function UserMiddleware(req, res, next) {
    return next();
  }

  it('should load a injected middleware', () => {
    Container.register('UserMiddleware', asValue(UserMiddleware));
    const middleware = Container.resolve('middleware');

    const uc = middleware('UserMiddleware');
    expect(uc).toBe(UserMiddleware);
  });

  it('should autocomplete the middleware name with "Controller" suffix', () => {
    Container.register('User', asValue(UserMiddleware));
    const middleware = Container.resolve('middleware');

    const uc = middleware('User');
    expect(uc).toBe(UserMiddleware);
  });

  it('should fail when the middleware does not exist', () => {
    const middleware = Container.resolve('middleware');

    const fn = () => middleware('Company');
    expect(fn).toThrow();
  });
});
