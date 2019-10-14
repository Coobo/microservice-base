import path from 'path';

import config from '../../src/config';
import db from '../../src/db';
import container from '../../src/di';

const asFunction = container.resolve('asFunction');
const asValue = container.resolve('asValue');
const asClass = container.resolve('asClass');
container.register({
  Application: asClass(
    class App {
      configPath() {
        return path.join(__dirname, 'config-path');
      }
    },
  ),
  Config: asClass(config),
});
const logger = { debug: jest.fn() };
container.register('Logger', asValue(logger));
container.register('Database', asFunction(db));

let Db;

beforeEach(() => {
  Db = container.resolve('Database');
});

describe('Database', () => {
  it('should expose model function', () => {
    expect(typeof Db.model).toBe('function');
  });

  it('should expose schema class', () => {
    expect(typeof Db.Schema).toBe('function');
  });
});
