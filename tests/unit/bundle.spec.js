import path from 'path';

import app from '../../src/app';
import controllerLoader from '../../src/app/controller';
import middlewareLoader from '../../src/app/middleware';
import validatorLoader from '../../src/app/validate';
import Container from '../../src/index';

app.prototype.configPath = () => {
  return path.join(__dirname, 'config-path');
};

const asClass = Container.resolve('asClass');
const asFunction = Container.resolve('asFunction');
const asValue = Container.resolve('asValue');

Container.register('Application', asClass(app));
Container.register('controller', asFunction(controllerLoader).singleton());
Container.register('middleware', asFunction(middlewareLoader).singleton());
Container.register('validate', asFunction(validatorLoader).singleton());
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
  class UserController {
    store() {}
  }

  it('should load a injected controller', () => {
    Container.register('UserController', asClass(UserController));
    const controller = Container.resolve('controller');

    const uc = controller('UserController');
    expect(uc instanceof UserController).toBe(true);
  });

  it('should autocomplete the controller name with "Controller" suffix', () => {
    Container.register('UserController', asClass(UserController));
    const controller = Container.resolve('controller');

    const uc = controller('User');
    expect(uc instanceof UserController).toBe(true);
  });

  it('should load a injected controller.method', () => {
    Container.register('UserController', asClass(UserController));
    const controller = Container.resolve('controller');

    const um = controller('User.store');
    expect(typeof um).toBe('function');
  });

  it('should fail when the controller does not exist', () => {
    const controller = Container.resolve('controller');

    const fn = () => controller('Company');
    expect(fn).toThrow();
  });

  it('should fail when the controller exists but the requested method does not exist', () => {
    Container.register('UserController', asClass(UserController));
    const controller = Container.resolve('controller');

    const fn = () => controller('User.index');
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

describe('validate helper function', () => {
  const validate = Container.resolve('validate');
  /** @type {import('@hapi/joi')} */
  const schema = Container.resolve('Validator');
  const UserValidator = schema.object().keys({
    username: schema.string().required(),
  });

  Container.register('UserValidator', asValue(UserValidator));

  it('should return a function', () => {
    const fn = validate('body', UserValidator);

    expect(typeof fn).toBe('function');
  });

  it('should work fine it provided with validator name', () => {
    const fn = validate('body', 'UserValidator');

    expect(typeof fn).toBe('function');
  });

  it('should fail if provided with invalid schema', () => {
    const fn = () => validate('body', {});

    expect(fn).toThrow();
  });
});
