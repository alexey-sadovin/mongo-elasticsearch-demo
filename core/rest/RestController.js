const HTTP_STATUS_CODE = Object.freeze({
  ok: 200,
  internalError: 500
});

/**
 * @abstract
 */
class RestController {

  /**
   * @param req
   * @param res
   * @param next
   */
  constructor(req, res, next) {
    /** @private */
    this.req = req;

    /** @private */
    this.res = res;

    /** @private */
    this.next = next;
  }

  /**
   * @param {number} statusCode
   * @param {Object} response
   * @returns {void}
   * @private
   */
  _sendResponse(statusCode, response) {
    this.res
      .status(statusCode)
      .json(response)
      .end();

    this.next();
  }

  /**
   * @returns {Promise<void>}
   * @protected
   */
  _processRequest() {
    throw new Error('Not implemented');
  }

  /**
   * @param {*} response
   * @returns {void}
   * @protected
   */
  ok(response) {
    this._sendResponse(HTTP_STATUS_CODE.ok, response);
  }

  /**
   * @param {*} response
   * @returns {void}
   * @protected
   */
  internalError(response) {
    this._sendResponse(HTTP_STATUS_CODE.internalError, response);
  }

  /**
   * @return {Promise<void>}
   */
  async handleRequest() {
    try {
      await this._processRequest();
    } catch (err) {
      this.internalError({
        error: err.message || 'something went wrong'
      });
    }
  }
}

module.exports = RestController;
