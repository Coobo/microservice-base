import BluePrintInterface from './blueprint-interface';

/**
 * Model Factory to seed database using mongoose
 *
 * @class ModelFactory
 * @constructor
 *
 * @group DatabaseFactory
 */
class ModelFactory extends BluePrintInterface {
  /**
   * Constructs the ModelFactory Class
   *
   * @constructor
   * @param {import('./index').Blueprint} blueprint
   * @param {import('../fake')} fake
   */
  constructor(blueprint, fake, db) {
    super(blueprint.callback, fake);
    this.Model = blueprint.name;
    this.db = db;
  }

  /**
   * Gets the Model Constructor for the blueprint.
   *
   * @method getModel
   *
   * @returns {import('mongoose').Model}
   *
   * @private
   * @throws {Error}
   */
  getModel() {
    if (this.db.has(this.Model)) return this.db.get(this.Model);

    throw new Error('The specified model does not exist.');
  }

  /**
   * Instantiates a new Model with attributes
   *
   * @method instantiateModel
   *
   * @param {object} attributes
   *
   * @return {import('mongoose').Document}
   *
   * @private
   */
  instantiateModel(attributes) {
    const ModelConstructor = this.getModel();

    return new ModelConstructor(attributes);
  }

  /**
   * Make a single model instance with attributes from blueprint fake values.
   *
   * @method make
   * @async
   *
   * @param {object} [data={}]
   * @param {number} [index=0]
   *
   * @returns {import('mongoose').Document}
   */
  async make(data = {}, index = 0) {
    const attributes = await this.makeOne(index, data);
    return this.instantiateModel(attributes);
  }

  /**
   * Make x number of model instances with fake data.
   *
   * @method makeMany
   * @async
   *
   * @param {number} instances
   * @param {object} [data={}]
   *
   * @return {{import('mongoose').Document[]}}
   */
  async makeMany(instances, data = {}) {
    const array = new Array(instances).fill(0);
    return Promise.all(array.map((value, index) => this.make(data, index)));
  }

  /**
   * Create model instance, persist it to database and return it back.
   *
   * @method create
   * @async
   *
   * @param {object} [data={}]
   * @param {number} [index=0]
   *
   * @return {import('mongoose').Document}
   */
  async create(data = {}, index = 0) {
    const modelInstance = await this.make(data, index);
    await modelInstance.save();
    return modelInstance;
  }

  /**
   * Persist multiple model instances to database and get them back as an array.
   *
   * @method createMany
   * @async
   *
   * @param {number} numberOfDocuments
   * @param {object} [data={}]
   *
   * @return {import('mongoose').Document[]}
   */
  async createMany(numberOfDocuments, data = {}) {
    const array = new Array(numberOfDocuments).fill(0);
    return Promise.all(array.map((value, index) => this.create(data, index)));
  }

  /**
   * Truncate the database collection.
   *
   * @method reset
   * @async
   *
   * @return {*}
   */
  async reset() {
    return this.getModel().deleteMany({});
  }
}

module.exports = ModelFactory;
