const mongoose = require('mongoose');

/**
 * @implements {DriverConnectionInterface}
 */
class MongoDriver {

  /**
   * @param {MongoCredentials} credentials
   */
  constructor(credentials) {
    /** @private */
    this.credentials = credentials;

    /** @private */
    this.connection = mongoose.connection;
  }

  /**
   * @returns {string}
   * @private
   */
  _composeMongoUrl() {
    const {
      host,
      port,
      db
    } = this.credentials;

    return `mongodb://${host}:${port}/${db}`;
  }

  /**
   * @return {Promise<void>}
   */
  async connect() {
    const connectionPromise = new Promise(resolve =>
      this.connection.on('connected', () => {
        console.log('Mongo connected');
        resolve();
      }));

    this.connection.on('reconnected', () => {
      console.log('Mongo reconnected');
    });

    mongoose
      .connect(this._composeMongoUrl(), {useNewUrlParser: true})
      .catch(err => {
        console.error('Mongo connection failed', err);
      });

    return connectionPromise;
  }

}

module.exports = MongoDriver;

/**
 * @typedef {Object} MongoCredentials
 *
 * @property {string} host
 * @property {number} port
 * @property {string} db
 */