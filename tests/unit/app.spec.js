import app from '../../src/app';
import '../utils/initialize-config';

describe('app', () => {
  it('should build a path from appRoot', () => {
    const path = app.path('test/path');

    expect(path.indexOf(app.root) > -1).toBeTruthy();
    expect(path.indexOf(app.folder) > -1).toBeTruthy();
  });

  it('should expose the app name', () => {
    app.load();
    expect(app.name).toBe('test-app');
  });
});
