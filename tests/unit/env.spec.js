import { join } from 'path';

import { EnvObject } from '../../src/env';

EnvObject._envPath = join(__dirname, 'env/.env');
EnvObject._testEnvPath = join(__dirname, 'env/.env.test');
const Env = EnvObject.init();

describe('Env', () => {
  it('should have loaded .env file on _envPath', () => {
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

  it('should ignore when no .env file is found', () => {
    const env = EnvObject;
    env._envPath = '/.env.not.existing';
    const fn = () => env.init();

    expect(fn).not.toThrow();
  });

  it('should replace .env with .env.testing values', () => {
    expect(Env.get('TO_REPLACE')).toBe('tchau');
  });
});
