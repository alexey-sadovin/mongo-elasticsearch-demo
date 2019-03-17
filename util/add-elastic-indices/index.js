const {ElasticDriver} = require('./../../core/drivers');
const {elasticCredentials} = require('./../../core/config');
const ElasticIndexUpdater = require('./ElasticIndexUpdater');

const elasticDriver = new ElasticDriver(elasticCredentials);

(async () => {
  await elasticDriver.connect();

  const updater = new ElasticIndexUpdater(elasticDriver);

  console.log('Start creating indices...');

  try {
    await updater.update();
  } catch (err) {
    console.error('Something went wrong', err);
    process.exit(1);
  }

  console.log('Finish creating indices');
  process.exit(0);
})();
