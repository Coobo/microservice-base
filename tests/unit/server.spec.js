import request from 'supertest';

import config from '../../src/config';
import server from '../../src/server';

server.init();

describe('server', () => {
  it('Should have registered default configs', () => {
    expect(typeof config.get('server')).toBe('object');
    expect(typeof config.get('server.cors')).toBe('object');
  });

  it('should have registered /status route', done => {
    request(server._express)
      .get('/status')
      .expect('Content-Type', /text/)
      .expect('Content-Length', '2')
      .expect(200, done);
  });

  it('should have set the request identifier middleware', done => {
    request(server._express)
      .get('/status')
      .expect('Content-Type', /text/)
      .expect('Content-Length', '2')
      .expect('Request-Id', /(.*-?)+/)
      .expect(200, done);
  });

  it('should should throw an error and return Youch object', done => {
    server._exceptionHandler();
    request(server._express)
      .get('/error')
      .expect('Content-Type', /json/)
      .expect('Request-Id', /(.*-?)+/)
      .expect(res => {
        res.body.error.message = 'Error route reached';
        res.body.error.name = 'Error';
      })
      .expect(500, done);
  });

  it('should open a new router', () => {
    const router = server.openRouter();

    expect(typeof router.get).toBe('function');
    expect(typeof router.post).toBe('function');
    expect(typeof router.put).toBe('function');
    expect(typeof router.delete).toBe('function');
    expect(typeof router.route).toBe('function');
  });

  it('should register a new router and make the endpoint available', done => {
    const router = server.openRouter();

    router.get('/children', (req, res) =>
      res.status(200).json({ message: 'ok' }),
    );

    server.useRouter('/parent', router);

    request(server._express)
      .get('/parent/children')
      .expect('Content-Type', /json/)
      .expect('Request-Id', /(.*-?)+/)
      .expect(res => {
        res.body.message = 'ok';
      })
      .expect(200, done);
  });

  describe('server authentication', () => {
    beforeEach(() =>
      config.set('server.authentication.allowedKeys', ''.split(',')),
    );

    it('should default authentication method to key', () => {
      expect(config.get('server.authentication.enabled')).toBeTruthy();
      expect(config.get('server.authentication.useKey')).toBeTruthy();
    });

    it('should fail if a not allowed key is provided', done => {
      request(server._express)
        .get('/status')
        .set('Key', 'notAllowedKey')
        .expect('Content-Type', /json/)
        .expect(res => {
          res.body.message = config.get('response.messages.unauthorized');
          res.body.reason = 'Invalid authentication key.';
        })
        .expect(401, done);
    });

    it('should succeed if a allowed key is provided', done => {
      config.set('server.authentication.allowedKeys', ['allowed']);

      request(server._express)
        .get('/status')
        .set('Key', 'allowed')
        .expect(200, done);
    });
  });
});
