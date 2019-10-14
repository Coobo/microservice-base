import path from 'path';
import request from 'supertest';

import config from '../../src/config';
import container from '../../src/di';
import env from '../../src/env';
import Logger from '../../src/log';
import LoggerMiddleware from '../../src/middlewares/logger';
import server from '../../src/server';

const asClass = container.resolve('asClass');
const asFunction = container.resolve('asFunction');
const asValue = container.resolve('asValue');
container.register({
  appRoot: asValue(path.join(__dirname, 'env')),
  Application: asClass(
    class App {
      configPath() {
        return path.join(__dirname, 'config-path');
      }
    },
  ),
  Env: asClass(env).singleton(),
  Config: asClass(config).singleton(),
  Server: asClass(server).singleton(),
  LoggerClass: asClass(Logger).singleton(),
  LoggerMiddleware: asFunction(LoggerMiddleware).singleton(),
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

  it('should open a new router', () => {
    const router = Server.openRouter();

    expect(typeof router.get).toBe('function');
    expect(typeof router.post).toBe('function');
    expect(typeof router.put).toBe('function');
    expect(typeof router.delete).toBe('function');
    expect(typeof router.route).toBe('function');
  });

  it('should register a new router and make the endpoint available', done => {
    const router = Server.openRouter();

    router.get('/children', (req, res) =>
      res.status(200).json({ message: 'ok' }),
    );

    Server.useRouter('/parent', router);

    request(Server._express)
      .get('/parent/children')
      .expect('Content-Type', /json/)
      .expect('Request-Id', /(.*-?)+/)
      .expect(res => {
        res.body.message = 'ok';
      })
      .expect(200, done);
  });
});
