import path from 'path';

import app from '../../src/app';
import Container from '../../src/index';

app.prototype.configPath = () => {
  return path.join(__dirname, 'config-path');
};

const asClass = Container.resolve('asClass');

Container.register('Application', asClass(app));
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
