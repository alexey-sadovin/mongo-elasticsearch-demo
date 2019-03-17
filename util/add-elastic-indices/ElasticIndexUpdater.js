const {elasticIndex} = require('./../../core/config');

class ElasticIndexUpdater {

  /**
   * @param {ElasticDriver} elasticDriver
   */
  constructor(elasticDriver) {
    /** @private */
    this.elasticDriver = elasticDriver;
  }

  /**
   * @return {Promise<void>}
   * @private
   */
  async _dropUserIndex() {
    await this.elasticDriver.deleteIndex({
      index: elasticIndex.indexName
    });
  }

  /**
   * @return {Promise<void>}
   * @private
   */
  async _addUserIndex() {
    await this.elasticDriver.createIndex({
      index: elasticIndex.indexName,
      body: {
        settings: {
          number_of_shards: 1,
          analysis: {
            filter: {
              autocomplete_filter: {
                type: 'edge_ngram',
                min_gram: 3,
                max_gram: 3
              }
            },
            analyzer: {
              autocomplete: {
                type: 'custom',
                tokenizer: 'standard',
                filter: [
                  'lowercase',
                  'autocomplete_filter'
                ]
              }
            }
          }
        }
      }
    });
  }

  /**
   * @return {Promise<void>}
   * @private
   */
  async _addMappingToIndex() {
    await this.elasticDriver.addMappingToIndex({
      index: elasticIndex.indexName,
      type: elasticIndex.indexType,
      body: {
        properties: {
          name: {
            type: 'text',
            analyzer: 'autocomplete'
          }
        }
      }
    });
  }

  /**
   * @return {Promise<void>}
   */
  async update() {
    await this._dropUserIndex().catch();
    await this._addUserIndex();
    await this._addMappingToIndex();
  }

}

module.exports = ElasticIndexUpdater;
