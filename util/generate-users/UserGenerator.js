const faker = require('faker');
const times = require('lodash/times');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const BulkDataCreator = require('./BulkDataCreator');
const User = require('./../../core/models/User');

const BULK_OPERATION_QTY = 1000;

class UserGenerator {

  /**
   * @param {number} qty
   */
  constructor(qty) {
    /** @private */
    this.qty = qty;

    /** @private */
    this.dataCreator = new BulkDataCreator(User.collection);
  }

  /**
   * @param {number} insertedQty
   * @param {number} qtyToCreate
   * @return {Object[]}
   * @private
   */
  _generateDocuments(insertedQty, qtyToCreate) {
    return times(qtyToCreate, i => {
      const currentQty = insertedQty + i;

      return {
        _id: new ObjectId(),
        nick: faker.internet.userName() + currentQty,
        email: faker.internet.email().replace('@', `@${currentQty}`),
        phone: faker.phone.phoneNumber() + currentQty,
        name: faker.name.findName()
      };
    });
  }

  /**
   * @param {number} insertedQty
   * @return {Promise<void>}
   * @private
   */
  async _insertUsers(insertedQty) {
    const allQty = this.qty - BULK_OPERATION_QTY;
    const qtyToCreate = allQty > 0 ?
      Math.min(BULK_OPERATION_QTY, allQty) :
      Math.min(BULK_OPERATION_QTY, this.qty);

    await this.dataCreator.create(
      this._generateDocuments(insertedQty, qtyToCreate));
  }

  /**
   * @returns {Promise<void>}
   */
  async run() {
    await User.collection.deleteMany({});

    let insertedQty = 0;
    for (; insertedQty < this.qty; insertedQty += BULK_OPERATION_QTY) {
      await this._insertUsers(insertedQty);
    }
  }

}

module.exports = UserGenerator;
