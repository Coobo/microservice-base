import app from '../../src/app';
import '../utils/initialize-config';

describe('app', () => {
  it('should expose the app name', () => {
    app.load();
    expect(app.name).toBe('test-app');
  });
});
