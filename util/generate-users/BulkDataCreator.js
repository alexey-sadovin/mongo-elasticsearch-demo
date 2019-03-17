class BulkDataCreator {

  /**
   * @param {Collection} collection
   */
  constructor(collection) {
    /** @private */
    this.collection = collection;
  }

  /**
   * @param {Object[]} documents
   * @returns {boolean}
   * @private
   */
  _isInvalidDocuments(documents) {
    return !Array.isArray(documents) || documents.length === 0;
  }

  /**
   * @param {Object[]} documents
   * @returns {Promise<void>}
   */
  async create(documents) {
    if (this._isInvalidDocuments(documents)) {
      throw new Error('Invalid documents length to create');
    }

    const bulk = this.collection.initializeOrderedBulkOp();
    documents.forEach(it => bulk.insert(it));
    await bulk.execute();
  }
}

module.exports = BulkDataCreator;