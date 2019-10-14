import container from '../../src/di';

describe('Dependency Injection Container', () => {
  it('Should resolve Container', () => {
    const c = container.resolve('Container');

    expect(typeof c.resolve).toBe('function');
    expect(typeof c.registrations).toBe('object');
  });

  it('Should resolve requireAll function', () => {
    const r = container.resolve('requireAll');

    expect(typeof r).toBe('function');
  });

  it('Should resolve esmResolver function', () => {
    const e = container.resolve('esmResolver');

    expect(typeof e).toBe('function');
  });

  it('Should resolve esmRequire function', () => {
    const e = container.resolve('esmRequire');

    expect(typeof e).toBe('function');
  });

  it('Should resolve asClass function', () => {
    const e = container.resolve('asClass');

    expect(typeof e).toBe('function');
  });

  it('Should resolve asValue function', () => {
    const e = container.resolve('asValue');

    expect(typeof e).toBe('function');
  });

  it('Should resolve asFunction function', () => {
    const e = container.resolve('asFunction');

    expect(typeof e).toBe('function');
  });

  it('Should resolve aliasTo function', () => {
    const e = container.resolve('aliasTo');

    expect(typeof e).toBe('function');
  });

  it('Should indefinetly resolve container', () => {
    let c = container;

    let loops = 5;
    while ((loops -= 1)) {
      c = c.resolve('Container');

      expect(typeof c.resolve).toBe('function');
      expect(typeof c.registrations).toBe('object');
    }
  });
});
