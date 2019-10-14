const DatabaseFactory = require('./database-factory');
const ModelFactory = require('./model-factory');

/**
 * Factory class is used to define blueprints and then get model ou database
 * factories in order to generate random data for testing purposes.
 *
 * @binding Factory
 * @singleton
 * @alias Factory
 * @group Database
 *
 * @class Factory
 * @constructor
 */
class Factory {
  /**
   * Constructs the Factory Class
   *
   * @constructor
   * @param {object} Dependencies
   * @param {import('@coobo/di')} Dependencies.Container
   * @param {import('../index').FakeLibrary} Dependencies.fake
   */
  constructor({ Container, fake }) {
    /** @type {Blueprint[]} */
    this.blueprints = [];
    this.Container = Container;
    this.fake = fake;
  }

  /**
   * Returns a string representing a model name
   *
   * @method getNameString
   *
   * @param {import('mongoose').Model|string} nameOrModel
   *
   * @return {string}
   */
  getNameString(nameOrModel) {
    return typeof nameOrModel === 'string'
      ? nameOrModel
      : nameOrModel.modelName;
  }

  /**
   * Register a new blueprint providing a MongooseModel or a Mongoose Model's
   * name as the first parameter and a callback returnin the fake data for
   * instantiating the Model.
   *
   * @method blueprint
   *
   * @param {import('mongoose').Model|string} nameOrModel
   * @param {function} callback
   *
   * @chainable
   *
   * @example
   * ```js
   * Factory.blueprint('User', (fake) => {
   *   return {
   *     username: fake.username(),
   *     password: async () => {
   *       return await Hash.make('secret')
   *     }
   *   }
   * })
   * ```
   */
  blueprint(nameOrModel, callback) {
    if (typeof callback !== 'function')
      throw new Error('Factory.blueprint callback must be a function.');

    this.blueprints.push({ name: this.getNameString(nameOrModel), callback });
    return this;
  }

  /**
   * Returns the blueprint map with the map
   * and the callback.
   *
   * @method getBlueprint
   *
   * @param {import('mongoose').Model|string} nameOrModel
   *
   * @return {Blueprint}
   */
  getBlueprint(nameOrModel) {
    const name = this.getNameString(nameOrModel);
    return this.blueprints.find(blueprint => blueprint.name === name);
  }

  /**
   * Get model factory instance for a registered blueprint.
   *
   * @method get
   *
   * @param {import('mongoose').Model|string} nameOrModel
   *
   * @return {ModelFactory}
   */
  model(nameOrModel) {
    const blueprint = this.getBlueprint(nameOrModel);
    return new ModelFactory(blueprint, this.fake, this.Container);
  }

  /**
   * Get database factory instance for a registered blueprint.
   *
   * @method get
   *
   * @param {import('mongoose').Model|string} nameOrModel
   *
   * @return {DatabaseFactory}
   */
  get(nameOrModel) {
    const blueprint = this.getBlueprint(nameOrModel);
    return new DatabaseFactory(blueprint, this.fake, this.Container);
  }

  /**
   * Clears all the registered blueprints
   *
   * @method {clear}
   *
   * @returns {void}
   */
  clear() {
    this.blueprints = [];
  }
}

module.exports = Factory;

/**
 * @typedef {Object} Blueprint
 * @property {string} name
 * @property {import('./blueprint-interface').BlueprintDataCallback} callback
 */
