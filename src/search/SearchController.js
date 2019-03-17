const {RestController} = require('./../../core/rest');
const SearchDataProvider = require('./SearchDataProvider');

/**
 * @extends RestController
 */
class SearchController extends RestController {

  /**
   * @inheritDoc
   */
  constructor(req, res, next) {
    super(req, res, next);

    /** @private */
    this.dataProvider = new SearchDataProvider(
      res.app.locals.services.getElasticDriver(),
      req.query.filter,
      req.query.cursor
    );
  }

  /**
   * @inheritDoc
   * @protected
   */
  async _processRequest() {
    const users = await this.dataProvider.search();
    this.ok(users);
  }

}

module.exports = SearchController;
