const omit = require('lodash/omit');
const MongoCursor = require('./MongoCursor');
const User = require('./../../core/models/User');
const {elasticIndex} = require('./../../core/config');

const USER_PROJECTION = Object.freeze({
  _id: 1,
  name: 1,
  nick: 1,
  phone: 1,
  email: 1
});

class MongoElasticMigration {

  /**
   * @param {ElasticDriver} elasticDriver
   */
  constructor(elasticDriver) {
    /** @private */
    this.elasticDriver = elasticDriver;

    /** @private */
    this.cursor = new MongoCursor(User.collection, USER_PROJECTION);
  }

  /**
   * @param {Object[]} documents
   * @return {Object}
   * @private
   */
  _composeElasticRequest(documents) {
    const commands = [];

    documents.forEach(user => {
      commands.push({
        index: {
          _index: elasticIndex.indexName,
          _type: elasticIndex.indexType,
          _id: user._id.toString()
        }
      });

      commands.push({
        ...omit(user, '_id'),
        id: user._id.toString()
      });
    });

    return {body: commands};
  }

  /**
   * @return {Promise<void>}
   */
  async run() {
    do {
      const documents = await this.cursor.getNext();

      if (documents.length > 0) {
        await this.elasticDriver.bulkInsert(
          this._composeElasticRequest(documents));
      }
    } while (this.cursor.hasNext());
  }

}

module.exports = MongoElasticMigration;
