const {Client: ElasticSearchClient} = require('elasticsearch');

const OPERATION = Object.freeze({
  ping: 'ping',
  bulkInsert: 'bulk',
  search: 'search',

  createIndex: 'create',
  deleteIndex: 'delete',
  addMappingToIndex: 'putMapping'
});

/**
 * @implements {DriverConnectionInterface}
 */
class ElasticDriver {

  /**
   * @param {ElasticCredentials} credentials
   */
  constructor(credentials) {
    /** @private */
    this.credentials = credentials;

    /** @private */
    this.connection = null;
  }

  /**
   * @returns {Object}
   * @private
   */
  _composeElasticConfig() {
    const {
      host,
      port
    } = this.credentials;

    return {
      host: `${host}:${port}`
    };
  }

  /**
   * @param {string} operationName
   * @param {boolean} withResponse
   * @param {*} options
   * @return {Promise<void>}
   * @private
   */
  _decorateClientRequest(operationName, withResponse, ...options) {
    return new Promise((resolve, reject) => {
      this.connection[operationName](
        ...options, this._decorateResponse(withResponse, resolve, reject));
    });
  }

  /**
   * @param {string} operationName
   * @param {boolean} withResponse
   * @param {*} options
   * @return {Promise<void>}
   * @private
   */
  _decorateIndexRequest(operationName, withResponse, ...options) {
    return new Promise((resolve, reject) => {
      this.connection.indices[operationName](
        ...options, this._decorateResponse(withResponse, resolve, reject));
    });
  }

  /**
   * @param {boolean} withResponse
   * @param {Function} resolve
   * @param {Function} reject
   * @private
   */
  _decorateResponse(withResponse, resolve, reject) {
    return (err, response) => {
      if (err) {
        return reject(err);
      }

      return withResponse ?
        resolve(response) :
        resolve();
    };
  }

  /**
   * @return {Promise<void>}
   */
  async connect() {
    this.connection = new ElasticSearchClient(this._composeElasticConfig());
    await this._decorateClientRequest(OPERATION.ping, true);
  }

  /**
   * @param {Object} body
   * @return {Promise<void>}
   */
  async bulkInsert(body) {
    return this._decorateClientRequest(OPERATION.bulkInsert, false, body);
  }

  /**
   * @param {Object} query
   * @return {Promise<Object[]>}
   */
  async search(query) {
    return this._decorateClientRequest(OPERATION.search, true, query);
  }

  /**
   * @param {Object} query
   * @return {Promise<void>}
   */
  async createIndex(query) {
    return this._decorateIndexRequest(OPERATION.createIndex, false, query);
  }

  /**
   * @param {Object} query
   * @return {Promise<Object[]>}
   */
  async deleteIndex(query) {
    return this._decorateIndexRequest(OPERATION.deleteIndex, false, query);
  }

  /**
   * @param {Object} query
   * @return {Promise<Object[]>}
   */
  async addMappingToIndex(query) {
    return this._decorateIndexRequest(OPERATION.addMappingToIndex, false, query);
  }

}

module.exports = ElasticDriver;

/**
 * @typedef {Object} ElasticCredentials
 *
 * @property {string} host
 * @property {number} port
 */
