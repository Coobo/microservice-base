/**
 * Factory Interface to seed dabatase using mongoose.
 *
 * @class BluePrintInterface
 * @constructor
 *
 * @group DatabaseFactory
 */
class BluePrintInterface {
  /**
   * @param {BlueprintDataCallback} dataCallback
   * @param {import('../fake')} fake
   */
  constructor(dataCallback, fake) {
    this.dataCallback = dataCallback;
    this.fake = fake;
  }

  /**
   * Make a single instance of blueprint for a given index. This method will
   * evaluate the functions in the return payload from blueprint.
   *
   * @method makeOne
   * @async
   *
   * @param {number} index
   * @param {object} data
   *
   * @returns {object}
   *
   * @private
   */
  async makeOne(index, data) {
    const hash = this.dataCallback(this.fake, index, data);
    const keys = Object.keys(hash);

    const values = await Promise.all(
      Object.values(hash).map(val =>
        typeof val === 'function' ? Promise.resolve(val()) : val,
      ),
    );

    return keys.reduce((result, key, keyIndex) => {
      result[key] = values[keyIndex];
      return result;
    }, {});
  }
}

module.exports = BluePrintInterface;

/**
 * @callback BlueprintDataCallback
 * @param {object} fake
 * @param {number} index
 * @param {object} data
 */
