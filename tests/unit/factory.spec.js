import mongoose from 'mongoose';
import path from 'path';

import config from '../../src/config';
import db from '../../src/db';
import container from '../../src/di';
import factoryContructor from '../../src/factory';
import DatabaseFactory from '../../src/factory/database-factory';
import ModelFactory from '../../src/factory/model-factory';
import fakeFunction from '../../src/fake';

const asFunction = container.resolve('asFunction');
const asValue = container.resolve('asValue');
const asClass = container.resolve('asClass');
container.register({
  Application: asClass(
    class App {
      configPath() {
        return path.join(__dirname, 'config-path');
      }
    },
  ),
  Config: asClass(config),
});
const logger = { debug: jest.fn() };
container.register('Logger', asValue(logger));
container.register('Database', asFunction(db));
container.register('Factory', asClass(factoryContructor));
container.register('fake', asValue(fakeFunction));

/** @type {import('mongoose').Mongoose} */
const Database = container.resolve('Database');
/** @type {import('../../src/infrastructure/factory').default} */
const Factory = container.resolve('Factory');

const globalTestModelName = 'NewTestingModel';
const model = Database.model(
  globalTestModelName,
  new mongoose.Schema({ username: String, _id: Number }, { versionKey: false }),
);
container.register(globalTestModelName, asValue(model));

describe('Factory', () => {
  beforeEach(() => {
    Factory.clear();
  });

  afterEach(async () => {
    await Database.connection.collection(globalTestModelName).deleteMany({});
    if (Database.models) {
      await Promise.all(
        Object.keys(Database.models).map(modelKey =>
          Database.models[modelKey].deleteMany({}),
        ),
      );
      // delete Database.models[globalTestModelName];
      // delete Database.modelSchemas[globalTestModelName];
    }
  });

  describe('blueprint method', () => {
    it('should accept a model name as a blueprint first parameter', () => {
      const blueprintName = 'User';

      Factory.blueprint(blueprintName, () => ({}));

      expect(Factory.blueprints.length).toBe(1);
      expect(Factory.blueprints[0].name).toBe(blueprintName);
    });

    it('should accept a model as a blueprint first parameter', () => {
      const modelName = globalTestModelName;

      Factory.blueprint(model, () => ({}));

      expect(Factory.blueprints.length).toBe(1);
      expect(Factory.blueprints[0].name).toBe(modelName);
    });

    it('should throw and error when callback is not provided', () => {
      const fn = () => Factory.blueprint(globalTestModelName);
      expect(fn).toThrow();
    });
  });

  describe('getBlueprint method', () => {
    describe('given a blueprint name', () => {
      it('should find a blueprint that was added by name string', () => {
        const blueprintName = 'User';

        Factory.blueprint(blueprintName, () => ({}));
        const blueprint = Factory.getBlueprint(blueprintName);

        expect(blueprint.name).toBe(blueprintName);
        expect(typeof blueprint.callback).toBe('function');
      });

      it('should find a blueprint that was added by model', () => {
        const modelName = globalTestModelName;

        Factory.blueprint(model, () => ({}));
        const blueprint = Factory.getBlueprint(modelName);

        expect(blueprint.name).toBe(modelName);
        expect(typeof blueprint.callback).toBe('function');
      });
    });

    describe('given a model', () => {
      it('should find a blueprint that was added by name string', () => {
        const modelName = globalTestModelName;

        Factory.blueprint(modelName, () => ({}));
        const blueprint = Factory.getBlueprint(model);

        expect(blueprint.name).toBe(modelName);
        expect(typeof blueprint.callback).toBe('function');
      });

      it('should find a blueprint that was added by model', () => {
        const modelName = globalTestModelName;

        Factory.blueprint(model, () => ({}));
        const blueprint = Factory.getBlueprint(model);

        expect(blueprint.name).toBe(modelName);
        expect(typeof blueprint.callback).toBe('function');
      });
    });
  });

  describe('get method', () => {
    it('should return an instance of DatabaseFactory', () => {
      const fn = () => {};
      Factory.blueprint('Model', fn);
      expect(Factory.get('Model')).toBeInstanceOf(DatabaseFactory);
    });

    describe('returned DatabaseFactory', () => {
      it('should generate data object for collection when chained with make', async () => {
        Factory.blueprint(globalTestModelName, () => {
          return { username: 'test' };
        });

        const doc = await Factory.get(globalTestModelName).make();
        expect(doc).toStrictEqual({ username: 'test' });
      });

      it('should generate array of data objects for collection when chained with makeMany', async () => {
        Factory.blueprint(globalTestModelName, (faker, i) => {
          return { username: 'test', _id: i + 1 };
        });

        const docs = await Factory.get(globalTestModelName).makeMany(2);
        expect(docs).toStrictEqual([
          { username: 'test', _id: 1 },
          { username: 'test', _id: 2 },
        ]);
      });

      it('should save data to collection when chained with create', async () => {
        const username = 'test';

        Factory.blueprint(globalTestModelName, (faker, i) => {
          return { username, _id: i + 1 };
        });

        await Factory.get(globalTestModelName)
          .database(Database)
          .create();

        const user = await Database.connection
          .collection(globalTestModelName)
          .findOne({ username });
        expect(user._id).toBe(1);
        expect(user.username).toBe(username);
      });

      it('should save array of data to collection when chained with createMany', async () => {
        const username = 'test';

        Factory.blueprint(globalTestModelName, (faker, i) => {
          return { username, _id: i + 1 };
        });

        await Factory.get(globalTestModelName)
          .database(Database)
          .createMany(2);

        const users = await Database.connection
          .collection(globalTestModelName)
          .find({ username })
          .toArray();

        expect(users.length).toBe(2);
        expect(users[0].username).toBe(username);
        expect(users[0]._id).toBe(1);
        expect(users[1].username).toBe(username);
        expect(users[1]._id).toBe(2);
      });

      it('should change collectionName on the fly', async () => {
        Factory.blueprint('test', () => {});

        const databaseFactory = Factory.get('test')
          .database(Database)
          .collection(globalTestModelName);

        expect(databaseFactory).toBeInstanceOf(DatabaseFactory);
        expect(databaseFactory.collectionName).toBe(globalTestModelName);
      });

      it('should empty database when reset is called', async () => {
        const username = 'test';

        Factory.blueprint(globalTestModelName, (faker, i) => {
          return { username, _id: i + 1 };
        });

        await Factory.get(globalTestModelName)
          .database(Database)
          .createMany(2);

        await Factory.get(globalTestModelName)
          .database(Database)
          .reset();

        const users = await Database.connection
          .collection(globalTestModelName)
          .find({ username })
          .toArray();

        expect(users.length).toBe(0);
      });
    });
  });

  describe('model method', () => {
    it('should return an instance of ModelFactory', () => {
      const fn = () => {};
      Factory.blueprint('Model', fn);
      expect(Factory.model('Model')).toBeInstanceOf(ModelFactory);
    });

    describe('returned ModelFactory', () => {
      it('should return data object from blueprint', async () => {
        const fn = () => ({ name: 'user' });
        Factory.blueprint('Model/User', fn);

        const val = await Factory.model('Model/User').makeOne(1);

        expect(val).toStrictEqual({ name: 'user' });
      });

      it('should evaluate functions in data object', async () => {
        const fn = () => ({ name: () => 'user' });
        Factory.blueprint('Model/User', fn);

        const val = await Factory.model('Model/User').makeOne(1);

        expect(val).toStrictEqual({ name: 'user' });
      });

      it('should evaluate async functions in data object', async () => {
        const fn = () => ({
          name: () => new Promise(resolve => resolve('user')),
        });
        Factory.blueprint('Model/User', fn);

        const val = await Factory.model('Model/User').makeOne(1);

        expect(val).toStrictEqual({ name: 'user' });
      });

      it('should make a single model instance', async () => {
        Factory.blueprint(globalTestModelName, () => ({ username: 'user' }));

        const val = await Factory.model(globalTestModelName).make();
        const amount = await model.countDocuments({});

        expect(val).toBeInstanceOf(model);
        expect(val.toObject()).toStrictEqual({ username: 'user' });
        expect(amount).toBe(0);
      });

      it('should make an array of model instances', async () => {
        Factory.blueprint(globalTestModelName, () => ({ username: 'user' }));

        const vals = await Factory.model(globalTestModelName).makeMany(2);
        const amount = await model.countDocuments({});

        expect(vals.length).toBe(2);
        expect(vals[0]).toBeInstanceOf(model);
        expect(vals[0].toObject()).toStrictEqual({ username: 'user' });
        expect(vals[1]).toBeInstanceOf(model);
        expect(vals[1].toObject()).toStrictEqual({ username: 'user' });
        expect(amount).toBe(0);
      });

      it('should make a single model instance even if registered with Model suffix', async () => {
        container.register(`${globalTestModelName}aModel`, asValue(model));
        Factory.blueprint(`${globalTestModelName}a`, () => ({
          username: 'user',
        }));

        const val = await Factory.model(`${globalTestModelName}a`).make();
        const amount = await model.countDocuments({});

        expect(val).toBeInstanceOf(model);
        expect(val.toObject()).toStrictEqual({ username: 'user' });
        expect(amount).toBe(0);
      });

      it('should fail if an unexisting model is passed', async () => {
        Factory.blueprint('FakeModel', () => ({
          username: 'user',
        }));

        const fn = async () => {
          return Factory.model(`FakeModel`).make();
        };

        await expect(fn()).rejects.toThrow();
      });

      it('should make an array of model instances with async attributes', async () => {
        Factory.blueprint(globalTestModelName, () => ({
          username: new Promise(resolve => resolve('user')),
        }));

        const vals = await Factory.model(globalTestModelName).makeMany(2);
        const amount = await model.countDocuments({});

        expect(vals.length).toBe(2);
        expect(vals[0]).toBeInstanceOf(model);
        expect(vals[0].toObject()).toStrictEqual({ username: 'user' });
        expect(vals[1]).toBeInstanceOf(model);
        expect(vals[1].toObject()).toStrictEqual({ username: 'user' });
        expect(amount).toBe(0);
      });

      it('should create a model instance', async () => {
        Factory.blueprint(globalTestModelName, () => ({
          username: 'user',
          _id: 1,
        }));

        const val = await Factory.model(globalTestModelName).create();
        const amount = await model.countDocuments({});

        expect(val).toBeInstanceOf(model);
        expect(val.toObject()).toStrictEqual({ username: 'user', _id: 1 });
        expect(amount).toBe(1);
      });

      it('should create many model instances', async () => {
        Factory.blueprint(globalTestModelName, (fake, i) => ({
          username: 'user',
          _id: i + 1,
        }));

        const vals = await Factory.model(globalTestModelName).createMany(2);
        const amount = await model.countDocuments({});

        expect(vals.length).toBe(2);
        expect(vals[0]).toBeInstanceOf(model);
        expect(vals[0].toObject()).toStrictEqual({ username: 'user', _id: 1 });
        expect(vals[1]).toBeInstanceOf(model);
        expect(vals[1].toObject()).toStrictEqual({ username: 'user', _id: 2 });
        expect(amount).toBe(2);
      });

      it('should empty database when reset is called', async () => {
        Factory.blueprint(globalTestModelName, (fake, i) => ({
          username: 'user',
          _id: i + 1,
        }));

        await Factory.model(globalTestModelName).createMany(2);
        await Factory.model(globalTestModelName).reset();
        const amount = await model.countDocuments({});

        expect(amount).toBe(0);
      });

      it('should pass custom data from create many', async () => {
        Factory.blueprint(globalTestModelName, (fake, i, data) => ({
          username: data[i].username,
          _id: i + 1,
        }));

        const vals = await Factory.model(globalTestModelName).createMany(2, [
          { username: 'user1' },
          { username: 'user2' },
        ]);
        const amount = await model.countDocuments({});

        expect(vals.length).toBe(2);
        expect(vals[0]).toBeInstanceOf(model);
        expect(vals[0].toObject()).toStrictEqual({ username: 'user1', _id: 1 });
        expect(vals[1]).toBeInstanceOf(model);
        expect(vals[1].toObject()).toStrictEqual({ username: 'user2', _id: 2 });
        expect(amount).toBe(2);
      });

      it('should pass custom data from make many', async () => {
        Factory.blueprint(globalTestModelName, (fake, i, data) => ({
          username: data[i].username,
          _id: i + 1,
        }));

        const vals = await Factory.model(globalTestModelName).makeMany(2, [
          { username: 'user1' },
          { username: 'user2' },
        ]);
        const amount = await model.countDocuments({});

        expect(vals.length).toBe(2);
        expect(vals[0]).toBeInstanceOf(model);
        expect(vals[0].toObject()).toStrictEqual({ username: 'user1', _id: 1 });
        expect(vals[1]).toBeInstanceOf(model);
        expect(vals[1].toObject()).toStrictEqual({ username: 'user2', _id: 2 });
        expect(amount).toBe(0);
      });

      it('should generate fake cnpj with punctuation', async () => {
        Factory.blueprint(globalTestModelName, (fake, i) => ({
          username: fake.cnpj(),
          _id: i + 1,
        }));

        const vals = await Factory.model(globalTestModelName).makeMany(2);

        expect(vals[0].toObject().username.length).toBe(18);
        expect(vals[1].toObject().username.length).toBe(18);
      });

      it('should generate fake cnpj without punctuation', async () => {
        Factory.blueprint(globalTestModelName, (fake, i) => ({
          username: fake.cnpj(false),
          _id: i + 1,
        }));

        const vals = await Factory.model(globalTestModelName).makeMany(2);

        expect(vals[0].toObject().username.length).toBe(14);
        expect(vals[1].toObject().username.length).toBe(14);
      });
    });
  });
});
