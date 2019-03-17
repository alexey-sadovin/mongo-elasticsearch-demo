const BULK_OPERATIONS_LIMIT = 100;
const DEFAULT_PROJECTION = Object.freeze({_id: 1});

class MongoCursor {

  /**
   * @param {Collection} collection
   * @param {Object} [projection]
   */
  constructor(collection, projection) {
    /** @private */
    this.collection = collection;

    /** @private */
    this.projection = projection ? projection : DEFAULT_PROJECTION;

    /**
     * @private
     * @type {?ObjectId}
     */
    this.lastId = null;
  }

  /**
   * @param {Object[]} documents
   * @return {MongoCursor}
   * @private
   */
  _setCursor(documents) {
    const length = documents.length;

    this.lastId = length > 0 ?
      documents[length - 1]._id :
      null;

    return this;
  }

  /**
   * @return {boolean}
   */
  hasNext() {
    return Boolean(this.lastId);
  }

  /**
   * @returns {Promise<Object[]>}
   */
  async getNext() {
    const condition = this.lastId ?
      {_id: {$gt: this.lastId}} :
      {};

    const options = {
      limit: BULK_OPERATIONS_LIMIT
    };
    if (this.projection) {
      options.projection = this.projection;
    }

    const documents = await this.collection
      .find(condition, options)
      .toArray();

    this._setCursor(documents);

    return documents;
  }

}

module.exports = MongoCursor;
