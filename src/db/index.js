const mongoose = require('mongoose');

/**
 * Factory function that requires @coobo/di to get injected dependencies and
 * returns a Mongoose connected instance.
 *
 * @function DatabaseFactory
 *
 * @binding DatabaseFactory
 * @alias DatabaseFactory
 * @group Database
 * @singleton
 *
 * @param {object} Dependencies
 * @param {import('@coobo/config').Config} Dependencies.Config
 * @param {import('@coobo/log').Logger} Dependencies.Logger
 *
 * @returns {import('mongoose').Mongoose}
 */
function DatabaseFactory({ Config, Logger }) {
  const db = new mongoose.Mongoose();
  db.connect(
    Config.get('db.uri'),
    Config.get('db.options', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
    }),
  );

  db.connection.on('error', e => {
    Logger.error({ message: 'Error whith the database connection.', error: e });
  });

  db.connection.once('open', () =>
    Logger.debug(
      `${Config.get(
        'app.name',
        'Application',
      ).capitalize()} successfully connected to MongoDB`,
    ),
  );

  return db;
}

module.exports = DatabaseFactory;
