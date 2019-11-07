import '../utils/initialize-config';
import db from '../../src/db';

describe('Database', () => {
  it('should expose model function', () => {
    expect(typeof db._connection.model).toBe('function');
  });

  it('should expose schema class', () => {
    expect(typeof db._connection.Schema).toBe('function');
  });

  it('should expose the connect function', () => {
    expect(typeof db.connect).toBe('function');
  });
});
