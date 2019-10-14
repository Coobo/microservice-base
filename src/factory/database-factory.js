import BluePrintInterface from './blueprint-interface';

/**
 * Collection factory to seed dabatase using mongoose Collections.
 *
 * @class DatabaseFactory
 * @constructor
 *
 * @group DatabaseFactory
 */
class DatabaseFactory extends BluePrintInterface {
  /**
   * Constructs the DatabaseFactory Class
   *
   * @constructor
   * @param {import('./index').Blueprint} blueprint
   */
  constructor(blueprint, fake, Container) {
    super(blueprint.callback, fake);
    this.collectionName = blueprint.name;
    this.connection = Container.resolve('Database');
  }

  /**
   * Specify the database connection to be used as source for the collection.
   *
   * @method connection
   *
   * @param {import('mongoose').Mongoose} Database
   *
   * @chainable
   */
  database(Database) {
    this.connection = Database;
    return this;
  }

  /**
   * Set collection to be used fot the database operations.
   *
   * @method collection
   *
   * @param {string} collectionName
   *
   * @chainable
   */
  collection(collectionName) {
    this.collectionName = collectionName;
    return this;
  }

  /**
   * Gets a mongoose collection from the connection.
   *
   * @method getCollection
   *
   * @returns {import('mongoose').Collection}
   */
  getCollection() {
    return this.connection.connection.collection(this.collectionName);
  }

  /**
   * Make a single collection instance with attributes from blueprint fake values.
   *
   * @method make
   * @async
   *
   * @param {object} [data={}]
   * @param {number} [index=0]
   *
   * @return {object}
   */
  async make(data = {}, index = 0) {
    return this.makeOne(index, data);
  }

  /**
   * Make x number of collection instances with fake data.
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
   * Create a collection instance, persists it to dabatase returns it back.
   *
   * @method create
   * @async
   *
   * @param {object} data
   * @param {number} [index=0]
   *
   * @return {import('mongoose').Document}
   */
  async create(data = {}, index = 0) {
    const attributes = await this.make(data, index);
    const collection = this.getCollection();

    return collection.insertOne(attributes);
  }

  /**
   * Persist multiple collection instances to database and get them back as an array.
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
    return this.getCollection().deleteMany({});
  }
}

module.exports = DatabaseFactory;
