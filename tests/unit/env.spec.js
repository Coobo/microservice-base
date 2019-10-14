import path from 'path';

import container from '../../src/di';
import env from '../../src/env';

const asValue = container.resolve('asValue');
const asClass = container.resolve('asClass');
container.register({
  Env: asClass(env),
  appRoot: asValue(path.join(__dirname, 'env')),
});

let Env;

beforeEach(() => {
  Env = container.resolve('Env');
});

describe('Env Class', () => {
  it('should have loaded .env file on appRoot', () => {
    expect(Env.get('APP_ENV')).toBe('testing');
  });

  it('should have parsed "on" value', () => {
    expect(Env.get('APP_TEST')).toBe(true);
  });

  it('should have parsed "false" value', () => {
    expect(Env.get('APP_TEST_TWO')).toBe(false);
  });

  it('should have parsed "1" value', () => {
    expect(Env.get('APP_TEST_THREE')).toBe(true);
  });

  it('should have parsed "null" value', () => {
    expect(Env.get('APP_TEST_FOUR')).toBe(null);
  });

  it('should have parsed "true" value', () => {
    expect(Env.get('APP_TEST_FIVE')).toBe(true);
  });

  it('should have parsed "off" value', () => {
    expect(Env.get('APP_TEST_SIX')).toBe(false);
  });

  it('should have parsed mustache reference', () => {
    expect(Env.get('REF')).toBe('testingRock');
  });

  it('should throw with getOrFail when accessing inexisting variable', () => {
    const fn = () => Env.getOrFail('NOT_EXISTING');
    expect(fn).toThrow();
  });

  it('should retrieve with getOrFail when accessing existing variable', () => {
    expect(Env.getOrFail('APP_TEST_THREE')).toBe(true);
  });

  it('should throw an error when no .env file is found', () => {
    const fn = () => env({ appRoot: '/' });
    expect(fn).toThrow();
  });

  it('should replace .env with .env.testing values', () => {
    expect(Env.get('TO_REPLACE')).toBe('tchau');
  });
});
