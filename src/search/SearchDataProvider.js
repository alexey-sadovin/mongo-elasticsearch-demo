const get = require('lodash/get');
const {elasticIndex} = require('./../../core/config');

const USERS_LIMIT = 20;
const DEFAULT_CURSOR = 1;

class SearchDataProvider {

  /**
   * @param {ElasticDriver} elasticDriver
   * @param {string} filter
   * @param {?string} [cursor]
   */
  constructor(elasticDriver, filter, cursor) {
    /** @private */
    this.elasticDriver = elasticDriver;

    /** @private */
    this.filter = filter;

    /** @private */
    this.cursor = cursor ?
      Number.parseInt(cursor, 10) :
      DEFAULT_CURSOR;
  }

  /**
   * @return {Object}
   * @private
   */
  _composeQuery() {
    return {
      query: {
        multi_match: {
          query: this.filter,
          fields: ['name', 'phone', 'email', 'nick'],
          analyzer: 'autocomplete'
        }
      }
    };
  }

  /**
   * @return {Promise<Object>}
   */
  async search() {
    const response = await this.elasticDriver.search({
      index: elasticIndex.indexName,
      from: (this.cursor - 1) * USERS_LIMIT,
      size: USERS_LIMIT,
      body: this._composeQuery()
    });

    return {
      cursor: get(response, 'took', null),
      items: get(response, 'hits.hits', [])
        .map(it => it._source)
    };
  }

}

module.exports = SearchDataProvider;
