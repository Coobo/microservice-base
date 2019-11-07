import config from '../utils/initialize-config';

describe('config', () => {
  it('should use provided default when config does not exist', () => {
    expect(config.get('aaa', 'teste')).toBe('teste');
  });

  it('should set a config', () => {
    config.set('aaa', 'ABCD');

    expect(config.get('aaa')).toBe('ABCD');
  });

  it('should set default configs', () => {
    config.defaults('tests', {
      a: 'b',
      b: 'c',
      c: { d: 'e' },
    });

    expect(config.get('tests.a')).toBe('b');
    expect(config.get('tests.b')).toBe('c');
    expect(config.get('tests.c.d')).toBe('e');
  });

  it('should have autoloaded config-path', () => {
    expect(config.get('app')).toStrictEqual({
      config: 'test',
      name: 'test-app',
      oneTest: true,
    });
    expect(config.get('app.config')).toBe('test');
    expect(config.get('app.oneTest')).toBe(true);
  });

  it('should not overwrite when passing defaults with already existing key', () => {
    config.defaults('app', {
      config: 'not-test',
      porta: 1001,
    });

    expect(config.get('app.config')).toBe('test');
    expect(config.get('app.oneTest')).toBe(true);
    expect(config.get('app.porta')).toBe(1001);
  });

  it('should use env to resolve functional configs', () => {
    expect(config.get('function.conf')).toBe(config._env);
    expect(typeof config.get('function.conf').get).toBe('function');
  });
});
