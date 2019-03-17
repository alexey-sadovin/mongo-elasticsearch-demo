const {ElasticDriver} = require('./drivers');
const {elasticCredentials} = require('./config');

const SERVICES = Object.freeze({
  elastic: 'elastic'
});

class ServiceFacade {

  constructor() {

    /**
     * @private
     * @type {Map<string, *>}
     */
    this.services = new Map();

    this.services.set(SERVICES.elastic, new ElasticDriver(elasticCredentials))
  }

  /**
   * @returns {ElasticDriver}
   */
  getElasticDriver() {
    return this.services.get(SERVICES.elastic);
  }

}

module.exports = ServiceFacade;
