import path from 'path';

import config from '../../src/config';
import container from '../../src/di';
import Logger from '../../src/log';
import APILogger from '../../src/log/api';

const asClass = container.resolve('asClass');
const asFunction = container.resolve('asFunction');
container.register({
  Application: asClass(
    class App {
      configPath() {
        return path.join(__dirname, 'config-path');
      }
    },
  ),
  Config: asClass(config),
  Logger: asClass(Logger).singleton(),
  APILogger: asFunction(APILogger).singleton(),
});

let Config;

beforeEach(() => {
  Config = container.resolve('Config');
});

describe('Config Class', () => {
  it('should use provided default when config does not exist', () => {
    expect(Config.get('aaa', 'teste')).toBe('teste');
  });

  it('should set a config', () => {
    Config.set('aaa', 'ABCD');

    expect(Config.get('aaa')).toBe('ABCD');
  });

  it('should set default configs', () => {
    Config.defaults('tests', {
      a: 'b',
      b: 'c',
      c: { d: 'e' },
    });

    expect(Config.get('tests.a')).toBe('b');
    expect(Config.get('tests.b')).toBe('c');
    expect(Config.get('tests.c.d')).toBe('e');
  });

  it('should have autoloaded config-path', () => {
    expect(Config.get('app')).toStrictEqual({ config: 'test', oneTest: true });
    expect(Config.get('app.config')).toBe('test');
    expect(Config.get('app.oneTest')).toBe(true);
  });

  it('should not overwrite when passing defaults with already existing key', () => {
    Config.defaults('app', {
      config: 'not-test',
      porta: 1001,
    });

    expect(Config.get('app.config')).toBe('test');
    expect(Config.get('app.oneTest')).toBe(true);
    expect(Config.get('app.porta')).toBe(1001);
  });

  it('should use container to resolve functional configs', () => {
    expect(Config.get('function.conf')).toBe(container);
    expect(typeof Config.get('function.conf').resolve).toBe('function');
  });
});
