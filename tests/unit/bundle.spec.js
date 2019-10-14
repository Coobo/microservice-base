import path from 'path';

import Container from '../../src/index';

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
