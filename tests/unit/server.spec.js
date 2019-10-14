import path from 'path';
import request from 'supertest';

import config from '../../src/config';
import container from '../../src/di';
import server from '../../src/server';

const asClass = container.resolve('asClass');
container.register({
  Application: asClass(
    class App {
      configPath() {
        return path.join(__dirname, 'config-path');
      }
    },
  ),
  Config: asClass(config).singleton(),
  Server: asClass(server).singleton(),
});

let Server;

beforeEach(() => {
  Server = container.resolve('Server');
});

describe('Server Class', () => {
  it('Should have registered default configs', () => {
    const c = container.resolve('Config');

    expect(typeof c.get('server')).toBe('object');
    expect(typeof c.get('server.cors')).toBe('object');
  });

  it('should have registered /status route', done => {
    request(Server._express)
      .get('/status')
      .expect('Content-Type', /text/)
      .expect('Content-Length', '2')
      .expect(200, done);
  });

  it('should have set the request identifier middleware', done => {
    request(Server._express)
      .get('/status')
      .expect('Content-Type', /text/)
      .expect('Content-Length', '2')
      .expect('Request-Id', /(.*-?)+/)
      .expect(200, done);
  });

  it('should should throw an error and return Youch object', done => {
    Server._registerErrorHandler();
    request(Server._express)
      .get('/error')
      .expect('Content-Type', /json/)
      .expect('Request-Id', /(.*-?)+/)
      .expect(res => {
        res.body.error.message = 'Error route reached';
        res.body.error.name = 'Error';
      })
      .expect(500, done);
  });
});
